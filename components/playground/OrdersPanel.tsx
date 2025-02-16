"use client";
import React, { useEffect, useMemo } from "react";
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
import { OperationMode, OrderTabs } from "../interfaces/Playground";
import {
  timestampToDateStr,
  TitleCase,
  transferNullToStr,
} from "@/utils/helpers";

const OrdersPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openingOrders } = useSelector((state: RootState) => state.fetchData);
  const { currentOrderTab } = useSelector(
    (state: RootState) => state.bottomPanel
  );

  const displayOrders = useMemo(() => {
    if (currentOrderTab === OrderTabs.Opening)
      return openingOrders.map((order) => transferNullToStr(order));
    else return [];
  }, [currentOrderTab, openingOrders]);

  useEffect(() => {
    dispatch(fetchOpeningOrders(OperationMode.PRACTISE));
  }, []);

  useEffect(() => {
    if (!openingOrders.length) return;
    console.log({ openingOrders });
  }, [openingOrders]);

  return (
    <div className="h-full flex flex-col gap-2">
      <ScrollArea className="flex-1">
        <Table>
          <TableCaption>{displayOrders.length ? "" : "No data"}</TableCaption>
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
