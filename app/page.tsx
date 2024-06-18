"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { CandlestickData, IChartApi, Time } from "lightweight-charts";
import React, { useEffect, useState } from "react";

const dummyLineData = [
  { value: 1800, time: "2023-01-02" },
  // { value: 8, time: 1642511722 },
  // { value: 10, time: 1642598122 },
  // { value: 20, time: 1642684522 },
  // { value: 3, time: 1642770922 },
  // { value: 43, time: 1642857322 },
  // { value: 41, time: 1642943722 },
  // { value: 43, time: 1643030122 },
  // { value: 56, time: 1643116522 },
  // { value: 46, time: 1643202922 },
];

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [chart, setChart] = useState<IChartApi>();

  const toggleIsDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
  }, [isDrawing, chart]);

  return (
    <div className="h-full flex">
      <TChart className="w-full h-full" chart={chart} setChart={setChart}>
        <CandlestickSeries seriesData={candlestickData} />
        <LineSeries seriesData={dummyLineData} />
        <div
          className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
          onClick={toggleIsDrawing}
        >
          {isDrawing ? "Finish Draw" : "Start Draw"}
        </div>
      </TChart>
    </div>
  );
};

export default Home;
