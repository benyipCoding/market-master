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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
    <div className="flex flex-col gap-4">
      <Table>
        <TableCaption>Order information.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Side</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Opening</TableHead>
            <TableHead className="text-right">Current</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <OrderActionItem label="Stop Loss" order={currentOrder} id="stoploss" />
      <OrderActionItem
        label="Take Profit"
        order={currentOrder}
        id="takeprofit"
      />
    </div>
  );
};

export default OrderActions;
