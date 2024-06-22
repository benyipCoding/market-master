"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { calcValue } from "@/utils/helpers";
import { RootState, AppDispatch } from "@/store";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawing } from "@/store/commonSlice";

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  const { isDrawing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  // const [chart, setChart] = useState<IChartApi>();
  const [candlestickSeries, setCandlestickSeries] =
    useState<ISeriesApi<"Candlestick", Time>>();
  const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line", Time>>();

  const toggleIsDrawing = () => {
    dispatch(toggleDrawing(!isDrawing));
  };

  // const drawStart = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   dom: HTMLDivElement | null
  // ) => {
  //   if (!isDrawing) return;
  //   if (!dom) throw new Error("Missing DOM");

  //   const [time, value] = calcValue(e, dom, candlestickSeries!, chart!);
  //   drawStartPoint = { value: value as number, time: time as UTCTimestamp };
  //   lineSeries?.setData([drawStartPoint!]);

  //   document.onmousemove = (event) => drawMove(event, dom);
  //   document.onmouseup = drawEnd;
  // };

  // const drawMove = (e: MouseEvent, dom: HTMLDivElement | null) => {
  //   console.log("draw move!");

  //   try {
  //     const [time, value] = calcValue(e, dom, candlestickSeries!, chart!);
  //     drawEndPoint = { value: value as number, time: time as UTCTimestamp };

  //     lineSeries?.setData(
  //       [drawStartPoint!, drawEndPoint!].sort(
  //         (a, b) =>
  //           new Date(a.time as string).getTime() -
  //           new Date(b.time as string).getTime()
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const drawEnd = () => {
  //   dispatch(toggleDrawing(false));
  //   document.onmousemove = null;
  // };

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };
  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  // useEffect(() => {
  //   chart?.applyOptions({
  //     handleScale: !isDrawing,
  //     handleScroll: !isDrawing,
  //     rightPriceScale: { autoScale: !isDrawing },
  //   });
  // }, [isDrawing, chart]);

  return (
    <div className="h-full flex bg-black">
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleIsDrawing}
      >
        {isDrawing ? "Finish Draw" : "Start Draw"}
      </div>

      <TChart className="w-4/5 h-4/5 m-auto">
        <CandlestickSeries
          seriesData={candlestickData}
          setSeries={setCandlestickSeries}
          customSeriesOptions={{ title: "XAU/USD" }}
        />
        <LineSeries
          setSeries={setLineSeries}
          isDrawing={isDrawing}
          customSeriesOptions={{ title: "drawLine_1" }}
        />
      </TChart>
    </div>
  );
};

export default Home;
