"use client";
import { CandlestickData, Time } from "lightweight-charts";
import { useSeries } from "@/hooks/useSeries";

interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
}

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const { series } = useSeries("Candlestick", seriesData);

  return null;
};

export default CandlestickSeries;
