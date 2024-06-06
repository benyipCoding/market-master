"use client";
import { useContext, useEffect, useState } from "react";
import { ChartContext } from "./TChart";
import {
  CandlestickSeriesPartialOptions,
  ISeriesApi,
  Time,
} from "lightweight-charts";
import axios from "axios";

// 蜡烛图系列的options
const candleStickOptions: CandlestickSeriesPartialOptions = {
  upColor: "transparent", // 阳线颜色为红色
  downColor: "#00ffff", // 阴线颜色为#00ffff
  borderVisible: true, // 蜡烛图边框可见
  wickVisible: true, // 线可见
  borderUpColor: "red", // 阳线边框颜色为红色
  borderDownColor: "#00ffff", // 阴线边框颜色为#00ffff
  wickUpColor: "red", // 阳线线颜色为红色
  wickDownColor: "#00ffff", // 阴线线颜色为#00ffff
  priceLineVisible: false,
};

const CandlestickSeries = () => {
  const { chart } = useContext(ChartContext);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick", Time>>();

  const getDummyData = async () => {
    const res = await axios.get("/api/dummy", { params: { id: 123 } });
    console.log("dummy data:", res.data);
  };

  useEffect(() => {
    if (!chart) return;
    setSeries(chart.addCandlestickSeries(candleStickOptions));
    getDummyData();
  }, [chart]);

  return null;
};

export default CandlestickSeries;
