"use client";
import CandlestickSeries from "@/components/CandlestickSeries";
import LineSeries from "@/components/LineSeries";
import TChart from "@/components/TChart";
import { getDummyData } from "@/utils/apis/getDummyData";
import { calcValue } from "@/utils/helpers";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useState } from "react";

let drawStartPoint: LineData<Time>;
let drawEndPoint: LineData<Time>;

const Home = () => {
  const [candlestickData, setCandlestickData] = useState<
    CandlestickData<Time>[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [chart, setChart] = useState<IChartApi>();
  const [candlestickSeries, setCandlestickSeries] =
    useState<ISeriesApi<"Candlestick", Time>>();
  const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line", Time>>();

  const toggleIsDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const drawStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    dom: HTMLDivElement | null
  ) => {
    if (!isDrawing) return;
    if (!dom) throw new Error("Missing DOM");

    const [time, value] = calcValue(e, dom, candlestickSeries!, chart!);
    drawStartPoint = { value: value as number, time: time as UTCTimestamp };
    lineSeries?.setData([drawStartPoint!]);

    document.onmousemove = (event) => drawMove(event, dom);
    document.onmouseup = drawEnd;
  };

  const drawMove = (e: MouseEvent, dom: HTMLDivElement | null) => {
    try {
      const [time, value] = calcValue(e, dom, candlestickSeries!, chart!);
      drawEndPoint = { value: value as number, time: time as UTCTimestamp };

      lineSeries?.setData(
        [drawStartPoint!, drawEndPoint!].sort(
          (a, b) =>
            new Date(a.time as string).getTime() -
            new Date(b.time as string).getTime()
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const drawEnd = () => {
    setIsDrawing(false);
    document.onmousemove = null;
  };

  const getCandlestickData = async () => {
    const res = await getDummyData();
    setCandlestickData(res.data);
  };
  // get dummy candlestick data
  useEffect(() => {
    getCandlestickData();
  }, []);

  useEffect(() => {
    chart?.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
  }, [isDrawing, chart]);

  return (
    <div className="h-full flex bg-black">
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleIsDrawing}
      >
        {isDrawing ? "Finish Draw" : "Start Draw"}
      </div>
      <TChart
        className="w-4/5 h-4/5 m-auto"
        chart={chart}
        setChart={setChart}
        onChartMouseDown={drawStart}
      >
        <CandlestickSeries
          seriesData={candlestickData}
          setSeries={setCandlestickSeries}
        />
        <LineSeries setSeries={setLineSeries} />
      </TChart>
    </div>
  );
};

export default Home;
