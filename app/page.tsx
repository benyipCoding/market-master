"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  Time,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

import { TChartRef } from "@/components/interfaces/TChart";
import Buttons from "@/components/Buttons";

const Home = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  // The list of drawed line series ..
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  return (
    <div className="h-full flex bg-black">
      <Buttons tChartRef={tChartRef} setDrawedLineList={setDrawedLineList} />
      <TChart
        className="w-full h-full m-auto"
        setDrawedLineList={setDrawedLineList}
        drawedLineList={drawedLineList}
        ref={tChartRef}
      >
        <CandlestickSeries
          seriesData={candlestickData}
          customSeriesOptions={{ id: "XAU/USD", title: "XAU/USD" }}
        />
        {drawedLineList.map((lineOption) => (
          <LineSeries customSeriesOptions={lineOption} key={lineOption.id} />
        ))}
      </TChart>
    </div>
  );
};

export default Home;
