"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
import { AppDispatch, RootState } from "@/store";
import { toggleDrawing } from "@/store/commonSlice";
import { calcValue } from "@/utils/helpers";
import clsx from "clsx";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  SeriesType,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import React, {
  PropsWithChildren,
  useEffect,
  useRef,
  createContext,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

interface TChartProps {
  className: string;
}

interface ChartContext {
  chart?: IChartApi;
  setChildSeries?: React.Dispatch<
    React.SetStateAction<ISeriesApi<SeriesType, Time>[]>
  >;
}

export const ChartContext = createContext<ChartContext>({});

const TChart: React.FC<PropsWithChildren<TChartProps>> = ({
  children,
  className,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { isDrawing } = useSelector((state: RootState) => state.common);

  const [chart, setChart] = useState<IChartApi>();
  const [childSeries, setChildSeries] = useState<
    ISeriesApi<SeriesType, Time>[]
  >([]);

  // const dispatch = useDispatch<AppDispatch>();

  // const drawStart = (
  //   mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   chartContainer: HTMLDivElement | null
  // ) => {
  //   if (!isDrawing) return;
  //   if (!chartContainer) throw new Error("Missing DOM");

  //   const [time, value] = calcValue(
  //     mouseEvent,
  //     chartContainer,
  //     candlestickSeries!,
  //     chart!
  //   );
  //   drawStartPoint = { value: value as number, time: time as UTCTimestamp };
  //   lineSeries?.setData([drawStartPoint!]);

  //   document.onmousemove = (mouseEvent) => drawMove(mouseEvent, chartContainer);
  //   document.onmouseup = drawEnd;
  // };

  // const drawMove = (e: MouseEvent, dom: HTMLDivElement | null) => {
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

  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));
  }, []);

  useEffect(() => {
    chart?.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
  }, [isDrawing, chart]);

  useEffect(() => {
    console.log(childSeries);
  }, [childSeries]);

  return (
    <div
      className={clsx("relative", className)}
      ref={container}
      // onMouseDown={(e) => drawStart(e, container.current)}
    >
      <ChartContext.Provider
        value={{
          chart,
          setChildSeries,
        }}
      >
        {children}
      </ChartContext.Provider>
    </div>
  );
};

export default TChart;
