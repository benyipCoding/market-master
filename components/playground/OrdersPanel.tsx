"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { fetchOpeningOrders } from "@/store/fetchDataSlice";
import { OperationMode, OrderNavs, OrderTabs } from "../interfaces/Playground";
import {
  timestampToDateStr,
  TitleCase,
  transferNullToStr,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { setCurrentOrderTab } from "@/store/bottomPanelSlice";

const OrdersPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openingOrders } = useSelector((state: RootState) => state.fetchData);
  const { currentOrderTab } = useSelector(
    (state: RootState) => state.bottomPanel
  );
  // slide block
  const [slideBlock, setSlideBlock] = useState({
    width: 0,
    left: 0,
  });

  const displayOrders = useMemo(() => {
    if (currentOrderTab === OrderTabs.Opening)
      return openingOrders.map((order) => transferNullToStr(order));
    else return [];
  }, [currentOrderTab, openingOrders]);

  const switchOrderTab = (tab: OrderTabs) => {
    dispatch(setCurrentOrderTab(tab));
  };

  const shapeSlideBlock = () => {
    const el = document.getElementById(currentOrderTab);
    if (!el) return;
    setSlideBlock({
      width: el.offsetWidth,
      left: el.offsetLeft,
    });
  };

  useEffect(() => {
    shapeSlideBlock();
  }, [currentOrderTab]);

  useEffect(() => {
    dispatch(fetchOpeningOrders(OperationMode.PRACTISE));

    setTimeout(() => {
      shapeSlideBlock();
    }, 150);
  }, []);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex gap-2 relative">
        {OrderNavs.map((tab) => (
          <div
            className={cn(
              "py-3 text-sm px-3 cursor-pointer text-[#a5a5a5] hover:text-white",
              currentOrderTab === tab.value && "dark:text-white text-black"
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
          className="absolute dark:bg-white bg-black bottom-0 left-0 h-[2px] transition-all duration-300"
          style={{ width: slideBlock.width, left: slideBlock.left }}
        ></div>
      </div>

      <ScrollArea className="flex-1">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order) => (
              <TableRow key={order.id}>
                {/* <TableCell className="font-medium">{order.id}</TableCell> */}
                <TableCell>{timestampToDateStr(order.create_at!)}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{TitleCase(order.side)}</TableCell>
                <TableCell className="text-right">
                  {order.opening_price}
                </TableCell>
                <TableCell className="text-right">
                  {order.closing_price}
                </TableCell>
                <TableCell className="text-right">{order.stop_price}</TableCell>
                <TableCell className="text-right">
                  {order.limit_price}
                </TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default OrdersPanel;
