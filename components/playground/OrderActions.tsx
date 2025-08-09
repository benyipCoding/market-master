import { retriveOrder } from "@/app/playground/actions/getOrders";
import { AppDispatch, RootState } from "@/store";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Order } from "../interfaces/Playground";
import {
  setCurrentOrderId,
  setPreLimitPrice,
  setPreStopPrice,
  setPriceLineIds,
} from "@/store/dialogSlice";
import OrderActionItem from "../commonFormItem/OrderActionItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TitleCase } from "@/utils/helpers";
import { Button } from "../ui/button";
import {
  PriceLineType,
  UpdatePriceLinePayload,
} from "../interfaces/CandlestickSeries";
import { DialogContext } from "@/context/Dialog";
import { EmitteryContext, OnPriceLine } from "@/providers/EmitteryProvider";

const OrderActions = () => {
  const { currentOrderId, preStopPrice, preLimitPrice, priceLineIds } =
    useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch<AppDispatch>();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { currentCandle } = useSelector((state: RootState) => state.fetchData);
  const { setDialogVisible } = useContext(DialogContext);
  const { emittery } = useContext(EmitteryContext);

  const onCancel = useCallback(() => {
    emittery?.emit(OnPriceLine.refresh);

    // 还原priceLine为订单原来的止损止盈位置
    // priceLineIds.forEach((id) => {
    //   const payload: UpdatePriceLinePayload = {
    //     id,
    //     options: {
    //       price: id.includes(PriceLineType.OpenOrderStopLoss)
    //         ? Number(currentOrder?.stop_price)
    //         : id.includes(PriceLineType.OpenOrderTakeProfit)
    //         ? Number(currentOrder?.limit_price)
    //         : undefined,
    //     },
    //   };
    //   emittery?.emit(OnPriceLine.update, payload);
    // });

    setDialogVisible(false);
  }, [emittery, setDialogVisible]);

  useEffect(() => {
    if (!currentOrderId) return;
    retriveOrder(currentOrderId).then((res) => {
      setCurrentOrder(res.data);
    });
  }, [currentOrderId]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentOrderId(null));
      dispatch(setPreStopPrice(undefined));
      dispatch(setPreLimitPrice(undefined));
      dispatch(setPriceLineIds(null));
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
        dynamicPrice={preStopPrice}
      />
      <OrderActionItem
        label="Take Profit"
        order={currentOrder}
        id={PriceLineType.OpenOrderTakeProfit}
        prop="limit_price"
        dynamicPrice={preLimitPrice}
      />

      <div className="flex items-center justify-end gap-4 mt-4">
        {/* <Button type="button" variant={"ghost"} size="sm">
          Reset
        </Button> */}
        <Button
          type="button"
          variant={"secondary"}
          size="sm"
          onClick={onCancel}
        >
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
