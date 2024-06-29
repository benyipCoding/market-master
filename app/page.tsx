"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { RootState, AppDispatch } from "@/store";
import {
  CandlestickData,
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  MouseEventParams,
  SeriesType,
  Time,
} from "lightweight-charts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawing } from "@/store/commonSlice";
import { throttle } from "@/utils/helpers";
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
  const [currentSeries, setCurrentSeries] =
    useState<ISeriesApi<SeriesType, Time>>();

  const toggleDrawingState = useCallback(
    () => dispatch(toggleDrawing(!isDrawing)),
    [dispatch, isDrawing]
  );

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    // console.log(param.point?.x);
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {
    const { childSeries } = tChartRef.current!;
    const hoverDatas = childSeries.filter((series) =>
      param.seriesData.get(series)
    );

    console.log(hoverDatas);
  };

  const onDeleteSeries = () => {
    const { chart, childSeries } = tChartRef.current!;
    chart.removeSeries(childSeries[1]);
    // console.log(childSeries[1]);
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    const { chart } = tChartRef.current!;

    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 500));
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
