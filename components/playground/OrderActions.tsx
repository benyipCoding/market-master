import { retriveOrder } from "@/app/playground/actions/getOrders";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Order } from "../interfaces/Playground";
import { setCurrentOrderId } from "@/store/dialogSlice";
import OrderActionItem from "../commonFormItem/OrderActionItem";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TitleCase } from "@/utils/helpers";
import { MiddleSection } from "../interfaces/TradingAside";
import { Button } from "../ui/button";
import { PriceLineType } from "../interfaces/CandlestickSeries";

const OrderActions = () => {
  const { currentOrderId } = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch<AppDispatch>();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { currentCandle } = useSelector((state: RootState) => state.fetchData);

  useEffect(() => {
    if (!currentOrderId) return;
    retriveOrder(currentOrderId).then((res) => {
      setCurrentOrder(res.data);
    });
  }, [currentOrderId]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentOrderId(null));
    };
  }, []);

  return (
    <div className="w-[400px] flex flex-col gap-4">
      <Table>
        {/* <TableCaption>Order information.</TableCaption> */}
        <TableHeader>
          <TableRow>
            {/* <TableHead>Time</TableHead> */}
            <TableHead>Quantity</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Opening</TableHead>
            {/* <TableHead>Stop</TableHead> */}
            {/* <TableHead>Limit</TableHead> */}
            <TableHead>Current</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          <TableRow>
            {/* <TableCell>
              {timestampToDateStr(currentOrder?.create_at!)}
            </TableCell> */}
            <TableCell>{currentOrder?.quantity}</TableCell>
            <TableCell>{TitleCase(currentOrder?.side)}</TableCell>
            <TableCell>{currentOrder?.opening_price}</TableCell>
            {/* <TableCell>{formatNull(currentOrder?.stop_price)}</TableCell>
            <TableCell>{formatNull(currentOrder?.limit_price)}</TableCell> */}
            <TableCell>{currentCandle?.close}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <OrderActionItem
        label="Stop Loss"
        order={currentOrder}
        id={PriceLineType.OpenOrderStopLoss}
        prop="stop_price"
      />
      <OrderActionItem
        label="Take Profit"
        order={currentOrder}
        id={PriceLineType.OpenOrderTakeProfit}
        prop="limit_price"
      />

      <div className="flex items-center justify-end gap-4 mt-4">
        {/* <Button type="button" variant={"ghost"} size="sm">
          Reset
        </Button> */}
        <Button type="button" variant={"secondary"} size="sm">
          Cancel
        </Button>
        <Button type="button" variant={"default"} size="sm">
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default OrderActions;
