"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";
import { defaultCandleStickOptions } from "@/constants/seriesOptions";
import {
  CandlestickData,
  createSeriesMarkers,
  ISeriesApi,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { EmitteryContext, OnOrderMarker } from "@/providers/EmitteryProvider";
import { OrderMarkerPayload, OrderSide } from "../interfaces/CandlestickSeries";
const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);
  const { emittery } = useContext(EmitteryContext);

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  const extraMainSeries = (): ISeriesApi<"Candlestick", Time> | undefined => {
    if (!tChartRef.current) return;
    return tChartRef.current.childSeries[0] as ISeriesApi<"Candlestick", Time>;
  };

  const marketOrderAction = (side: OrderSide) => {
    const mainSeries = extraMainSeries()!;
    const currentCandle = mainSeries.data()[
      mainSeries?.data().length - 1
    ] as CandlestickData;

    const payload: OrderMarkerPayload = {
      side,
      price: currentCandle.close,
      time: currentCandle.time,
    };

    emittery?.emit(OnOrderMarker.add, payload);
  };

  return (
    <div className={cn(className)} ref={asideRef}>
      <div className="flex gap-4">
        <Button
          variant={"default"}
          className="active:scale-100 flex-1 text-xl"
          style={{ backgroundColor: defaultCandleStickOptions.upColor }}
          onClick={() => marketOrderAction(OrderSide.buy)}
        >
          Buy
        </Button>
        <Button
          variant={"default"}
          className="active:scale-100 flex-1 text-xl"
          style={{ backgroundColor: defaultCandleStickOptions.downColor }}
          onClick={() => marketOrderAction(OrderSide.sell)}
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default forwardRef(Aside);
