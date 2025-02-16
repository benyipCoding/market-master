"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import {
  AsideRef,
  AsideProps,
  OrderStatus,
  OperationMode,
} from "../interfaces/Playground";
import { Button } from "../ui/button";
import { defaultCandleStickOptions } from "@/constants/seriesOptions";
import { CandlestickData, ISeriesApi, Time } from "lightweight-charts";
import { EmitteryContext, OnOrderMarker } from "@/providers/EmitteryProvider";
import { OrderSide, OrderType } from "../interfaces/CandlestickSeries";
import {
  CreateOrderDto,
  postMarketOrder,
} from "@/app/playground/actions/createMarketOrder";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toast } from "sonner";
import { fetchOpeningOrders } from "@/store/fetchDataSlice";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);
  const { emittery } = useContext(EmitteryContext);
  const { currentSymbol } = useSelector((state: RootState) => state.fetchData);
  const dispatch = useDispatch<AppDispatch>();

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  const extraMainSeries = (): ISeriesApi<"Candlestick", Time> | undefined => {
    if (!tChartRef.current) return;
    return tChartRef.current.childSeries[0] as ISeriesApi<"Candlestick", Time>;
  };

  const marketOrderAction = async (side: OrderSide) => {
    const mainSeries = extraMainSeries()!;
    const currentCandle = mainSeries.data()[
      mainSeries?.data().length - 1
    ] as CandlestickData;

    const payload: CreateOrderDto = {
      side,
      opening_price: currentCandle.close,
      time: currentCandle.time!,
      order_type: OrderType.MARKET,
      symbol_id: currentSymbol?.id!,
      quantity: 1000, // 暂时写死
      operation_mode: OperationMode.PRACTISE,
    };

    try {
      const res = await postMarketOrder(payload);
      if (res.status !== 200) return toast.error(res.msg);

      // 增加marker
      emittery?.emit(OnOrderMarker.add, payload);

      // 查询订单表
      dispatch(fetchOpeningOrders(OperationMode.PRACTISE));
    } catch (error) {}
  };

  return (
    <div className={cn(className)} ref={asideRef}>
      <div className="flex gap-4">
        <Button
          variant={"default"}
          className="active:scale-100 flex-1 text-xl"
          style={{ backgroundColor: defaultCandleStickOptions.borderUpColor }}
          onClick={() => marketOrderAction(OrderSide.BUY)}
        >
          Buy
        </Button>
        <Button
          variant={"default"}
          className="active:scale-100 flex-1 text-xl"
          style={{ backgroundColor: defaultCandleStickOptions.borderDownColor }}
          onClick={() => marketOrderAction(OrderSide.SELL)}
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default forwardRef(Aside);
