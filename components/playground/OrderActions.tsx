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
import { timestampToDateStr, TitleCase } from "@/utils/helpers";
import { MiddleSection } from "../interfaces/TradingAside";

const OrderActions = () => {
  const { currentOrderId } = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch<AppDispatch>();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { currentCandle } = useSelector((state: RootState) => state.fetchData);
  const [stoploss, setStoploss] = useState({
    active: false,
    displayType: MiddleSection.Price,
    stopPrice: 0,
  });

  const formatNull = (value: any) => {
    if (!value) return "N/A";
    return value;
  };

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

  useEffect(() => {
    console.log({ currentOrder });
  }, [currentOrder]);

  return (
    <div className="w-fit flex flex-col gap-4">
      <Table>
        {/* <TableCaption>Order information.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Opening</TableHead>
            <TableHead>Stop</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Current</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          <TableRow>
            <TableCell>
              {timestampToDateStr(currentOrder?.create_at!)}
            </TableCell>
            <TableCell>{currentOrder?.quantity}</TableCell>
            <TableCell>{TitleCase(currentOrder?.side)}</TableCell>
            <TableCell>{currentOrder?.opening_price}</TableCell>
            <TableCell>{formatNull(currentOrder?.stop_price)}</TableCell>
            <TableCell>{formatNull(currentOrder?.limit_price)}</TableCell>
            <TableCell>{currentCandle?.close}</TableCell>
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
