"use client";
import { useSeries } from "@/hooks/useSeries";
import { CandlestickSeriesProps } from "./interfaces/CandlestickSeries";
import { memo, useEffect } from "react";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  const { series } = useSeries("Candlestick", seriesData, customSeriesOptions);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
