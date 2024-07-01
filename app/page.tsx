"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import {
  CandlestickData,
  LineSeriesPartialOptions,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { findHoveringSeries, throttle } from "@/utils/helpers";
import { TChartRef } from "@/components/interfaces/TChart";
import Buttons from "@/components/Buttons";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Home = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  // The list of drawed line series
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);
  const [isGrabing, setIsGrabing] = useState(false);
  const { isDrawing, mousePressing } = useSelector(
    (state: RootState) => state.common
  );

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    const { selectedSeries } = tChartRef.current!;
    if (!selectedSeries) return;
    const data = param.seriesData.get(selectedSeries);

    if (data) setIsGrabing(true);
    else setIsGrabing(false);

    console.log(data);
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {
    try {
      if (!tChartRef.current) return;
      const { lineId_equation, childSeries, chart, setSelectedSeries } =
        tChartRef.current;
      if (!param.point) return;

      const hoveringSeries = findHoveringSeries(
        childSeries,
        chart,
        lineId_equation,
        param.point
      );

      if (hoveringSeries) {
        setSelectedSeries(hoveringSeries);
      } else {
        setSelectedSeries(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    const { chart } = tChartRef.current!;
    // Subscribe event when chart init
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 10));
    chart.subscribeClick(chartClickHandler);
  }, [tChartRef.current?.chart]);

  return (
    <div className="h-full flex bg-black">
      <Buttons tChartRef={tChartRef} setDrawedLineList={setDrawedLineList} />
      <TChart
        className={clsx(
          "w-full h-full m-auto",
          isGrabing && "cursor-grab",
          isDrawing && mousePressing && "cursor-grabbing"
        )}
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
