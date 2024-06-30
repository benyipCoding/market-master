"use client";
import { useSeries } from "@/hooks/useSeries";
import { CandlestickSeriesProps } from "./interfaces/CandlestickSeries";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  useSeries("Candlestick", seriesData, customSeriesOptions);

  return null;
};

export default CandlestickSeries;
