"use client";
import {
  CandlestickData,
  CandlestickSeriesPartialOptions,
  Time,
} from "lightweight-charts";
import { useSeries } from "@/hooks/useSeries";

interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
  customSeriesOptions?: CandlestickSeriesPartialOptions;
}

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
  customSeriesOptions,
}) => {
  useSeries("Candlestick", seriesData, customSeriesOptions);

  return null;
};

export default CandlestickSeries;
