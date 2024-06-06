"use client";
import { useContext, useEffect, useState } from "react";
import { ChartContext } from "./TChart";
import { CandlestickData, ISeriesApi, Time } from "lightweight-charts";
import { defaultCandleStickOptions } from "@/constants/seriesOptions";

interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
}

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const { chart } = useContext(ChartContext);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick", Time>>();

  useEffect(() => {
    if (!chart) return;
    setSeries(chart.addCandlestickSeries(defaultCandleStickOptions));
  }, [chart]);

  useEffect(() => {
    if (!series || !seriesData || !seriesData.length) return;

    series.setData(seriesData);
  }, [series, seriesData]);

  return null;
};

export default CandlestickSeries;
