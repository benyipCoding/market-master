"use client";
import { useSeries } from "@/hooks/useSeries";
import { CandlestickSeriesProps } from "./interfaces/CandlestickSeries";
import { memo, useContext, useEffect, useMemo } from "react";
import { EmitteryContext, OnApply } from "@/providers/EmitteryProvider";
import {
  SeriesPartialOptions,
  CandlestickStyleOptions,
  CandlestickData,
  Time,
} from "lightweight-charts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { symbolToSeriesOptions } from "@/store/fetchDataSlice";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const customOptions = useSelector((state: RootState) =>
    symbolToSeriesOptions(state)
  );
  const { series } = useSeries("Candlestick", seriesData, customOptions);
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

  useEffect(() => {
    if (!seriesData.length) return;
  }, [seriesData]);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
