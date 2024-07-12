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
import { throttle } from "@/utils/helpers";
import { TChartRef } from "@/components/interfaces/TChart";
import Buttons from "@/components/Buttons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  setMouseClickEventParam,
  setMouseDblClickEventParam,
  setMouseMovingEventParam,
} from "@/store/commonSlice";
import Tooltips from "@/components/Tooltips";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Home = () => {
  // TChart component instance
  const tChartRef = useRef<TChartRef>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);

  // The list of drawed line series
  const [drawedLineList, setDrawedLineList] = useState<
    LineSeriesPartialOptions[]
  >([]);

  // dialog trigger
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };

  const crosshairMoveHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseMovingEventParam(param));
  };

  const chartClickHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseClickEventParam(param));
  };

  const chartDblClickHandler = (param: MouseEventParams<Time>) => {
    dispatch(setMouseDblClickEventParam(param));
  };

  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    if (!tChartRef.current?.chart) return;
    const { chart } = tChartRef.current!;
    // Subscribe event when chart init
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 0));
    chart.subscribeClick(chartClickHandler);
    chart.subscribeDblClick(chartDblClickHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tChartRef.current?.chart]);

  return (
    <>
      <div className="h-full flex bg-black">
        <Buttons tChartRef={tChartRef} setDrawedLineList={setDrawedLineList} />
        <TChart
          className="w-full h-full m-auto"
          setDrawedLineList={setDrawedLineList}
          drawedLineList={drawedLineList}
          dialogTrigger={dialogTriggerRef.current}
          ref={tChartRef}
        >
          <CandlestickSeries
            seriesData={candlestickData}
            customSeriesOptions={{ id: "XAU/USD" }}
          />
          {drawedLineList.map((lineOption) => (
            <LineSeries customSeriesOptions={lineOption} key={lineOption.id} />
          ))}
          <Tooltips productName="XAU/USD" tChartRef={tChartRef} />
        </TChart>
      </div>

      <Dialog>
        <DialogTrigger
          ref={dialogTriggerRef}
          className="hidden"
        ></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <div className="w-full h-full bg-pink-300">123</div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
