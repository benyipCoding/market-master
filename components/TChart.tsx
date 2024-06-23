"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
import { useEnableDrawingLine } from "@/hooks/useEnableDrawingLine";
import { RootState } from "@/store";
import clsx from "clsx";
import {
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineSeriesPartialOptions,
  LineStyleOptions,
  SeriesOptionsCommon,
  SeriesType,
  Time,
} from "lightweight-charts";
import React, {
  PropsWithChildren,
  useRef,
  createContext,
  useState,
  useEffect,
} from "react";
import { useSelector } from "react-redux";

interface TChartProps {
  className: string;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  drawable?: boolean;
  drawedLineList: LineSeriesPartialOptions[];
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
  setDrawedLineList,
  drawable = true,
  drawedLineList,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { isDrawing } = useSelector((state: RootState) => state.common);
  const [chart, setChart] = useState<IChartApi>();

  // Collection of series instances for all children components
  const [childSeries, setChildSeries] = useState<
    ISeriesApi<SeriesType, Time>[]
  >([]);

  const { drawStart, cleanUp } = useEnableDrawingLine({
    chart: chart!,
    childSeries,
    drawedLineList,
    setDrawedLineList,
  });

  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));

    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    chart?.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
  }, [isDrawing, chart]);

  return (
    <div
      className={clsx("relative", className)}
      ref={container}
      onMouseDown={(e) => (drawable ? drawStart(e, container.current) : null)}
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
