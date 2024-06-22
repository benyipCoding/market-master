"use client";
import { CandlestickData, ISeriesApi, Time } from "lightweight-charts";
import { useSeries } from "@/hooks/useSeries";
import { useEffect } from "react";

interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
  setSeries: React.Dispatch<
    React.SetStateAction<ISeriesApi<"Candlestick", Time> | undefined>
  >;
}

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
  setSeries,
}) => {
  const { series } = useSeries("Candlestick", seriesData);

  useEffect(() => {
    setSeries(series as ISeriesApi<"Candlestick", Time>);
  }, [series, setSeries]);

  return null;
};

export default CandlestickSeries;
