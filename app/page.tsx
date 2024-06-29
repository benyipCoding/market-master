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
import { calcMouseCoordinate, isWithinRange, throttle } from "@/utils/helpers";
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
    // const { childSeries, chart } = tChartRef.current!;
    // let hoverSeries = childSeries.filter(
    //   (series, index) => param.seriesData.get(series) && index !== 0
    // );
    // if (!hoverSeries.length) return;
    // hoverSeries = hoverSeries.filter((series) => {
    //   const price = series.coordinateToPrice(param.point!.y);
    //   const seriesData = series.data();
    //   return seriesData.some((data) => {
    //     return isWithinRange((data as LineData<Time>).value, price!);
    //   });
    // });
    // if (!hoverSeries.length) return;
    // hoverSeries.forEach((series) => {
    //   console.log(series.options().title);
    // });
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {
    console.log(param.point);

    // const { childSeries, chart } = tChartRef.current!;
    // let hoverSeries = childSeries.filter(
    //   (series, index) => param.seriesData.get(series) && index !== 0
    // );
    // if (!hoverSeries.length) return;
    // hoverSeries = hoverSeries.filter((series) => {
    //   const price = series.coordinateToPrice(param.point!.y);
    //   const seriesData = series.data();
    //   return seriesData.some((data) => {
    //     return isWithinRange((data as LineData<Time>).value, price!);
    //   });
    // });
    // if (!hoverSeries.length) return;
    // const marker = new Map<number, ISeriesApi<"Line">>();
    // hoverSeries.forEach((series) => {
    //   series.data().forEach((data) => {
    //     const x = (data.customValues!.x as number) - param.point!.x;
    //     const y = (data.customValues!.y as number) - param.point!.y;
    //     const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //     marker.set(distance, series as ISeriesApi<"Line">);
    //   });
    // });
    // const keys = [...marker.keys()];
    // const minKey = Math.min(...keys);
    // const selectedSeries = marker.get(minKey);
    // console.log("selectedSeries:", selectedSeries?.options().title);
  };

  const onDeleteSeries = () => {
    const { chart, childSeries } = tChartRef.current!;
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    const { chart } = tChartRef.current!;

    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 100));
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
