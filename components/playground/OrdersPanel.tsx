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
  ClosePosAction,
  OperationMode,
  Order,
  OrderNavs,
  OrdersPanelProps,
  OrderStatus,
  OrderTabs,
} from "../interfaces/Playground";
import {
  formatNumberWithCommas,
  isInRange,
  timestampToDateStr,
  TitleCase,
  transferNullToStr,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { setCurrentOrderTab } from "@/store/bottomPanelSlice";
import { AuthContext } from "@/context/Auth";
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
import {
  DialogContentType,
  setCurrentOrderId,
  setDialogContent,
} from "@/store/dialogSlice";
import { Button } from "../ui/button";

const OrdersPanel: React.FC<OrdersPanelProps> = ({ setDialogVisible }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setUserProfile } = useContext(AuthContext);
  const {
    openingOrders,
    operationMode,
    closedOrders,
    limitOrders,
    currentCandle,
    backTestRecordKey,
    currentSymbol,
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
          .div(currentSymbol?.price_per_tick!)
          .times(order.quantity)
          .div(100)
          .toFixed(2);
      } else {
        return new Big(order.opening_price)
          .minus(currentCandle.close)
          .div(currentSymbol?.price_per_tick!)
          .times(order.quantity)
          .div(100)
          .toFixed(2);
      }
    },
    [currentCandle, currentSymbol?.price_per_tick]
  );

  // 浮动盈亏
  const displayProfitLoss = useMemo(() => {
    const num = openingOrders.reduce(
      (total, order) =>
        Number(new Big(total).add(calFloatingProfit(order)).toFixed(2)),
      0
    );

    return num;
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

  const closePosition = useCallback(
    async (
      orderId?: string,
      action: ClosePosAction = ClosePosAction.Actively
    ) => {
      if (!backTestRecordKey) return;
      const id = orderId || currentRowOrderId;
      if (!id) return;
      await postClosePosition(id, action);
      dispatch(fetchOpeningOrders(backTestRecordKey));
      dispatch(fetchClosedOrders(backTestRecordKey));
      getProfile().then((res) => setUserProfile(res.data));
    },
    [currentRowOrderId, backTestRecordKey, dispatch, setUserProfile]
  );

  // 打开OrderActions弹窗
  const openOrderActionsDialog = (order: Order) => {
    dispatch(setDialogContent(DialogContentType.OrderActions));
    dispatch(setCurrentOrderId(order.id));
    setDialogVisible(true);
  };

  const dynamicDisplay = (order: Order, type: "stop" | "limit") => {
    const price = type === "stop" ? order.stop_price : order.limit_price;
    const textContent = isNaN(Number(price)) ? "Set" : `${price}`;
    return (
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => openOrderActionsDialog(order)}
      >
        {textContent}
      </Button>
    );
  };

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

  // 监听是否有打止损或止盈的情况
  useEffect(() => {
    if (!currentCandle) return;
    const range = [Number(currentCandle?.low), Number(currentCandle?.high)];

    for (const o of openingOrders) {
      if (Number(o.time) === Number(currentCandle.time)) continue;

      // 打止损
      if (o.stop_price) {
        if (isInRange(Number(o.stop_price), range)) {
          closePosition(o.id, ClosePosAction.StopLoss);
          continue;
        }
      }
      // 打止盈
      if (o.limit_price) {
        if (isInRange(Number(o.limit_price), range)) {
          closePosition(o.id, ClosePosAction.TakeProfit);
          continue;
        }
      }
    }
  }, [closePosition, currentCandle, openingOrders]);

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

        <div className="absolute right-0 h-full flex gap-4">
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
            <p>$ {formatNumberWithCommas(displayProfitLoss)}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <ContextMenu
          onOpenChange={(open) => !open && setCurrentRowOrderId(null)}
        >
          <ContextMenuTrigger>
            <Table className="text-base">
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
                    <TableCell className="py-2">
                      {timestampToDateStr(order.create_at!)}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{TitleCase(order.side)}</TableCell>
                    <TableCell className="text-right py-2">
                      {order.opening_price}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      {order.status === OrderStatus.EXECUTED
                        ? currentCandle?.close
                        : order.closing_price}
                    </TableCell>

                    {/* 止损 */}
                    <TableCell className="text-right py-2">
                      {order.status === OrderStatus.EXECUTED
                        ? dynamicDisplay(order, "stop")
                        : order.stop_price}
                    </TableCell>

                    {/* 止盈 */}
                    <TableCell className="text-right py-2">
                      {order.status === OrderStatus.EXECUTED
                        ? dynamicDisplay(order, "limit")
                        : order.limit_price}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      ${" "}
                      {order.status === OrderStatus.EXECUTED
                        ? calFloatingProfit(order)
                        : order.profit}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => closePosition(order.id)}
                        className="active:scale-100"
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-fit">
            <ContextMenuLabel inset>Order Actions</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem inset onSelect={() => closePosition()}>
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
