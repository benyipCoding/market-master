"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { AsideRef, AsideProps, OperationMode } from "../interfaces/Playground";
import { CandlestickData, ISeriesApi, Time } from "lightweight-charts";
import { EmitteryContext, OnOrderMarker } from "@/providers/EmitteryProvider";
import { OrderSide, OrderType } from "../interfaces/CandlestickSeries";
import {
  CreateOrderDto,
  // postMarketOrder,
} from "@/app/playground/actions/createOrder";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toast } from "sonner";
import TradingAside from "./TradingAside";
import { ScrollArea } from "../ui/scroll-area";

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

  return (
    <ScrollArea className={cn(className)} ref={asideRef}>
      <TradingAside />
    </ScrollArea>
  );
};

export default forwardRef(Aside);
