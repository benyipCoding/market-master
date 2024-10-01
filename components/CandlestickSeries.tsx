"use client";
import { useSeries } from "@/hooks/useSeries";
import { CandlestickSeriesProps } from "./interfaces/CandlestickSeries";
import { memo, useContext, useEffect } from "react";
import { EmitteryContext, OnApply } from "@/providers/EmitteryProvider";
import {
  SeriesPartialOptions,
  CandlestickStyleOptions,
  CandlestickData,
  Time,
} from "lightweight-charts";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { series } = useSeries("Candlestick", seriesData, customSeriesOptions);
  const { emittery } = useContext(EmitteryContext);

  const resetDataHandler = ({
    customOptions,
    seriesData,
  }: {
    customOptions: SeriesPartialOptions<CandlestickStyleOptions>;
    seriesData: CandlestickData<Time>[];
  }) => {
    series?.applyOptions(customOptions);
    series?.setData(seriesData);
  };

  useEffect(() => {
    emittery?.on(OnApply.ResetMainSeriesData, resetDataHandler);

    return () => {
      emittery?.off(OnApply.ResetMainSeriesData, resetDataHandler);
    };
  }, [series]);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
