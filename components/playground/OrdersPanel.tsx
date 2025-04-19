"use client";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { fetchLimitOrders, fetchOpeningOrders } from "@/store/fetchDataSlice";
import { OperationMode, OrderNavs, OrderTabs } from "../interfaces/Playground";
import {
  formatNumberWithCommas,
  timestampToDateStr,
  TitleCase,
  transferNullToStr,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { setCurrentOrderTab } from "@/store/bottomPanelSlice";
import { AuthContext } from "@/context/Auth";
import { getProfile } from "@/app/playground/actions/getProfile";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
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
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";

const OrdersPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openingOrders, operationMode, limitOrders } = useSelector(
    (state: RootState) => state.fetchData
  );
  const { currentOrderTab } = useSelector(
    (state: RootState) => state.bottomPanel
  );
  const { userInfo, userProfile } = useContext(AuthContext);
  const displayBalance = useMemo(() => {
    if (operationMode === OperationMode.PRACTISE) {
      return userProfile?.balance_p
        ? formatNumberWithCommas(userProfile.balance_p)
        : 0;
    } else {
      return userProfile?.balance_b
        ? formatNumberWithCommas(userProfile.balance_b)
        : 0;
    }
  }, [operationMode, userProfile?.balance_b, userProfile?.balance_p]);

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
    else return [];
  }, [currentOrderTab, openingOrders, limitOrders]);

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

  useEffect(() => {
    if (!currentOrderTab) return;
    const dom = document.getElementById(currentOrderTab);
    initResizeObserver(dom);
    return () => {
      obs.current?.unobserve(dom!);
    };
  }, [currentOrderTab]);

  useEffect(() => {
    dispatch(fetchOpeningOrders(OperationMode.PRACTISE));
    dispatch(fetchLimitOrders(OperationMode.PRACTISE));
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
        {/* slide block */}
        <div
          className="absolute bottom-0 left-0 transition-all duration-200 bg-secondary/50 border-b-[2px] dark:border-white border-black rounded-sm rounded-b-none"
          style={{
            width: slideBlock.width,
            left: slideBlock.left,
            height: slideBlock.height,
          }}
        ></div>

        <div className="absolute right-0 h-full flex">
          <div className="w-32">
            <p className="text-xs">Account</p>
            <p>{userInfo?.display_name}</p>
          </div>
          <div className="w-32">
            <p className="text-xs">Balance</p>
            <p>{displayBalance} $</p>
          </div>
          <div className="w-32">
            <p className="text-xs">Profit / Loss</p>
            <p>0 $</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <ContextMenu>
          <ContextMenuTrigger>
            <Table>
              <TableCaption>
                {displayOrders.length ? "" : "No order data"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>ID</TableHead> */}
                  <TableHead>Time</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Sell / Buy</TableHead>
                  <TableHead className="text-right">Opening</TableHead>
                  <TableHead className="text-right">Closed</TableHead>
                  <TableHead className="text-right">Stop</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="text-right">Profit / Loss</TableHead>
                  <TableHead className="w-7"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.map((order) => (
                  <TableRow key={order.id}>
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
                    <TableCell className="text-right">$250.00</TableCell>
                    <TableCell className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} className="p-2">
                            <Ellipsis size={24} />
                          </Button>
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
            <ContextMenuItem inset>Close position</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Close all positions</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ScrollArea>
    </div>
  );
};

export default OrdersPanel;
