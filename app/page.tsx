"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart, { TChartRef } from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { RootState, AppDispatch } from "@/store";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawing } from "@/store/commonSlice";
import { throttle } from "@/utils/helpers";

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  const { isDrawing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);
  const chartRef = useRef<TChartRef>(null);

  const toggleDrawingState = () => {
    dispatch(toggleDrawing(!isDrawing));
  };

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    console.log(chartRef.current?.childSeries);
  };

  const bindChartEvent = () => {
    chartRef.current?.chart.subscribeCrosshairMove(
      throttle(crosshairMoveHandler, 1000)
    );
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  return (
    <div className="h-full flex bg-black">
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleDrawingState}
      >
        {isDrawing ? "Finish Draw" : "Start Draw"}
      </div>
      <div
        className="absolute left-40 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={bindChartEvent}
      >
        Bind Chart Event
      </div>

      <TChart
        className="w-4/5 h-4/5 m-auto"
        setDrawedLineList={setDrawedLineList}
        drawedLineList={drawedLineList}
        ref={chartRef}
      >
        <CandlestickSeries
          seriesData={candlestickData}
          customSeriesOptions={{ title: "XAU/USD" }}
        />
        {drawedLineList.map((lineOption) => (
          <LineSeries customSeriesOptions={lineOption} key={lineOption.title} />
        ))}
      </TChart>
    </div>
  );
};

export default Home;
