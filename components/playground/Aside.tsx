"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { AsideRef, AsideProps, OperationMode } from "../interfaces/Playground";
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
import TradingAside from "./TradingAside";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, tChartRef, currentCandle },
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
      <TradingAside currentPrice={currentCandle?.close} />
    </div>
  );
};

export default forwardRef(Aside);
