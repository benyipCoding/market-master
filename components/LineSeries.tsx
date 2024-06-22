"use client";
import {
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect } from "react";
import { useSeries } from "@/hooks/useSeries";
import { calcValue } from "@/utils/helpers";

interface LineSeriesProps {
  seriesData?: LineData<Time>[];
  setSeries?: React.Dispatch<
    React.SetStateAction<ISeriesApi<"Line", Time> | undefined>
  >;
  isDrawing?: boolean;
  customSeriesOptions?: LineSeriesPartialOptions;
}

const LineSeries: React.FC<LineSeriesProps> = ({
  seriesData,
  setSeries,
  isDrawing,
  customSeriesOptions,
}) => {
  const { series } = useSeries("Line", seriesData, customSeriesOptions);

  let drawStartPoint: LineData<Time>;
  let drawEndPoint: LineData<Time>;

  // const drawStart = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   dom: HTMLDivElement | null
  // ) => {
  //   if (!isDrawing) return;
  //   if (!dom) throw new Error("Missing DOM");
  //   console.log("draw start!");

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
  //   console.log("draw end!");

  //   setIsDrawing(false);
  //   document.onmousemove = null;
  // };

  useEffect(() => {
    setSeries!(series as ISeriesApi<"Line", Time>);
  }, [series, setSeries]);

  return null;
};

export default LineSeries;
