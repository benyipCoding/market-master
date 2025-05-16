"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchClosedOrders,
  fetchLimitOrders,
  fetchOpeningOrders,
} from "@/store/fetchDataSlice";
import {
  OperationMode,
  Order,
  OrderNavs,
  OrderTabs,
} from "../interfaces/Playground";
import {
  formatNumberWithCommas,
  timestampToDateStr,
  TitleCase,
  transferNullToStr,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { setCurrentOrderTab } from "@/store/bottomPanelSlice";
import { AuthContext } from "@/context/Auth";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import Big from "big.js";
import { OrderSide } from "../interfaces/CandlestickSeries";
import { postClosePosition } from "@/app/playground/actions/postClosePosition";
import { getProfile } from "@/app/playground/actions/getProfile";

const OrdersPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { setUserProfile } = useContext(AuthContext);
  const {
    openingOrders,
    operationMode,
    closedOrders,
    limitOrders,
    currentCandle,
    backTestRecordKey,
  } = useSelector((state: RootState) => state.fetchData);
  const { currentOrderTab } = useSelector(
    (state: RootState) => state.bottomPanel
  );
  const { userInfo, userProfile } = useContext(AuthContext);

  // slide block
  const [slideBlock, setSlideBlock] = useState({
    width: 0,
    left: 0,
    height: 0,
  });

  const displayOrders = useMemo(() => {
    if (currentOrderTab === OrderTabs.Opening)
      return openingOrders.map((order) => transferNullToStr(order));
    else if (currentOrderTab === OrderTabs.Limit)
      return limitOrders.map((order) => transferNullToStr(order));
    else if (currentOrderTab === OrderTabs.Closed)
      return closedOrders.map((order) => transferNullToStr(order));
    else return [];
  }, [currentOrderTab, openingOrders, limitOrders, closedOrders]);

  const switchOrderTab = (tab: OrderTabs) => {
    dispatch(setCurrentOrderTab(tab));
  };

  const obs = useRef<ResizeObserver | null>(null);
  const initResizeObserver = (dom: HTMLElement | null) => {
    if (!dom) return;
    obs.current = new ResizeObserver((entries) => {
      entries.forEach((e) => {
        const dom = e.target as HTMLDivElement;
        setSlideBlock({
          width: dom.offsetWidth,
          height: dom.offsetHeight,
          left: dom.offsetLeft,
        });
      });
    });
    obs.current.observe(dom);
  };

  const [currentRowOrderId, setCurrentRowOrderId] = useState<string | null>(
    null
  );

  const onRowContextMenu = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    orderId: string
  ) => {
    setCurrentRowOrderId(orderId);
  };

  const calFloatingProfit = useCallback(
    (order: Order) => {
      if (!currentCandle) return 0;
      if (order.side === OrderSide.BUY) {
        return new Big(currentCandle.close)
          .minus(order.opening_price)
          .toFixed(2);
      } else {
        return new Big(order.opening_price)
          .minus(currentCandle.close)
          .toFixed(2);
      }
    },
    [currentCandle]
  );

  // 浮动盈亏
  const displayProfitLoss = useMemo(() => {
    return openingOrders.reduce(
      (total, order) =>
        Number(new Big(total).add(calFloatingProfit(order)).toFixed(2)),
      0
    );
  }, [calFloatingProfit, openingOrders]);

  // 浮动余额
  const displayBalance = useMemo(() => {
    if (!userProfile) return 0;

    if (operationMode === OperationMode.PRACTISE) {
      const balance = Number(
        new Big(userProfile.balance_p).add(displayProfitLoss).toFixed(2)
      );
      return formatNumberWithCommas(balance);
    } else {
      const balance = Number(
        new Big(userProfile.balance_b).add(displayProfitLoss).toFixed(2)
      );
      return formatNumberWithCommas(balance);
    }
  }, [displayProfitLoss, operationMode, userProfile]);

  const closePosition = useCallback(async () => {
    if (!currentRowOrderId || !backTestRecordKey) return;
    await postClosePosition(currentRowOrderId);
    dispatch(fetchOpeningOrders(backTestRecordKey));
    dispatch(fetchClosedOrders(backTestRecordKey));
    getProfile().then((res) => setUserProfile(res.data));
  }, [currentRowOrderId, dispatch, backTestRecordKey]);

  useEffect(() => {
    if (!currentOrderTab) return;
    const dom = document.getElementById(currentOrderTab);
    initResizeObserver(dom);
    return () => {
      obs.current?.unobserve(dom!);
    };
  }, [currentOrderTab]);

  useEffect(() => {
    if (!backTestRecordKey) return;
    dispatch(fetchOpeningOrders(backTestRecordKey));
    dispatch(fetchLimitOrders(backTestRecordKey));
    dispatch(fetchClosedOrders(backTestRecordKey));
  }, [backTestRecordKey, dispatch]);

  useEffect(() => {
    return () => {
      if (obs.current) {
        obs.current?.disconnect();
        obs.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex gap-2 relative">
        {OrderNavs.map((tab) => (
          <div
            className={cn(
              "py-3 text-sm px-3 cursor-pointer text-[#a5a5a5] hover:text-white select-none z-10",
              currentOrderTab === tab.value && "dark:text-white text-blacky"
            )}
            key={tab.value}
            id={tab.value}
            onClick={() => switchOrderTab(tab.value)}
          >
            {tab.label}
          </div>
        ))}

        <div
          className="absolute bottom-0 left-0 transition-all duration-200 bg-secondary/50 border-b-[2px] dark:border-white border-black rounded-sm rounded-b-none"
          style={{
            width: slideBlock.width,
            left: slideBlock.left,
            height: slideBlock.height,
          }}
        ></div>

        <div className="absolute right-0 h-full flex">
          <div className="min-w-32">
            <p className="text-xs">Account</p>
            <p>{userInfo?.display_name}</p>
          </div>
          <div className="min-w-32">
            <p className="text-xs">Balance</p>
            <p>$ {displayBalance}</p>
          </div>
          <div className="min-w-32">
            <p className="text-xs">Profit / Loss</p>
            <p>$ {displayProfitLoss}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <ContextMenu
          onOpenChange={(open) => !open && setCurrentRowOrderId(null)}
        >
          <ContextMenuTrigger>
            <Table>
              <TableCaption>
                {displayOrders.length ? "" : "No order data"}
              </TableCaption>
              <TableHeader>
                <TableRow onContextMenu={(e) => e.preventDefault()}>
                  <TableHead>Time</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Sell / Buy</TableHead>
                  <TableHead className="text-right">Opening</TableHead>
                  <TableHead className="text-right">Closed</TableHead>
                  <TableHead className="text-right">Stop</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="text-right">Profit / Loss</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    onContextMenu={(e) => onRowContextMenu(e, order.id)}
                  >
                    <TableCell>
                      {timestampToDateStr(order.create_at!)}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{TitleCase(order.side)}</TableCell>
                    <TableCell className="text-right">
                      {order.opening_price}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.closing_price}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.stop_price}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.limit_price}
                    </TableCell>
                    <TableCell className="text-right">
                      $ {calFloatingProfit(order)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu
                        onOpenChange={(open) => {
                          !open && setCurrentRowOrderId(null);
                          open && setCurrentRowOrderId(order.id);
                        }}
                      >
                        <DropdownMenuTrigger asChild className="w-full">
                          <Ellipsis
                            className={cn(
                              "cursor-pointer text-gray-400 hover:text-white"
                            )}
                          />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-fit">
                          <DropdownMenuLabel inset>
                            Order Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem inset>
                            Set stop loss
                          </DropdownMenuItem>
                          <DropdownMenuItem inset>
                            Set limit price
                          </DropdownMenuItem>
                          <DropdownMenuItem inset>
                            Close position
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem inset>
                            Close all positions
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-fit">
            <ContextMenuLabel inset>Order Actions</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Set stop loss</ContextMenuItem>
            <ContextMenuItem inset>Set limit price</ContextMenuItem>
            <ContextMenuItem inset onSelect={closePosition}>
              Close position
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Close all positions</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ScrollArea>
    </div>
  );
};

export default OrdersPanel;
