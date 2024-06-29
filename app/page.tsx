"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { RootState, AppDispatch } from "@/store";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawing } from "@/store/commonSlice";
import { isWithinRange, throttle } from "@/utils/helpers";
import { TChartRef } from "@/components/interfaces/TChart";

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  const { isDrawing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);
  const tChartRef = useRef<TChartRef>(null);

  const toggleDrawingState = useCallback(
    () => dispatch(toggleDrawing(!isDrawing)),
    [dispatch, isDrawing]
  );

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    try {
      if (!tChartRef.current) return;
      const { lineId_equation, childSeries } = tChartRef.current;
      if (!childSeries[1]) return;
      const id = childSeries[1]?.options().title;
      const setX = childSeries[1]
        .data()
        .map((d) => d.customValues!.x as number)
        .sort((a, b) => a - b);
      if (!lineId_equation[id]) return;
      const equation = lineId_equation[id];
      const isClickLine =
        isWithinRange(equation(param.point!.x), param.point!.y) &&
        param.point!.x >= setX[0] &&
        param.point!.x <= setX[1];
      if (isClickLine) {
        console.log("hovering line" + id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {};

  const onDeleteSeries = () => {};

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    const { chart } = tChartRef.current!;

    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 0));
    chart.subscribeClick(chartClickHandler);
  }, [tChartRef.current?.chart]);

  return (
    <div className="h-full flex bg-black">
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleDrawingState}
      >
        {isDrawing ? "Finish Draw" : "Start Draw"}
      </div>

      <div
        className="absolute left-40 top-0 p-2 bg-red-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={onDeleteSeries}
      >
        Delete
      </div>

      <TChart
        className="w-4/5 h-4/5 m-auto"
        setDrawedLineList={setDrawedLineList}
        drawedLineList={drawedLineList}
        ref={tChartRef}
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
