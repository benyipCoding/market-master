"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
import { useEnableDrawingLine } from "@/hooks/useEnableDrawingLine";
import { AppDispatch, RootState } from "@/store";
import clsx from "clsx";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesType,
  Time,
} from "lightweight-charts";
import React, {
  PropsWithChildren,
  useRef,
  createContext,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TChartRef, TChartProps, IChartContext } from "./interfaces/TChart";
import { Equation, findHoveringSeries, throttle } from "@/utils/helpers";
import { toggleIsCanGrab } from "@/store/commonSlice";

export const ChartContext = createContext<IChartContext>({});

const TChart: React.ForwardRefRenderFunction<
  TChartRef,
  PropsWithChildren<TChartProps>
> = (
  { children, className, setDrawedLineList, drawable = true, drawedLineList },
  ref
) => {
  const container = useRef<HTMLDivElement>(null);
  const { isDrawing, isCanGrab, mousePressing } = useSelector(
    (state: RootState) => state.common
  );
  const [chart, setChart] = useState<IChartApi>();
  const [lineId_equation, setLineId_equation] = useState<
    Record<string, Equation>
  >({});
  const [selectedSeries, setSelectedSeries] = useState<ISeriesApi<
    SeriesType,
    Time
  > | null>(null);

  // Collection of series instances for all children components
  const [childSeries, setChildSeries] = useState<
    ISeriesApi<SeriesType, Time>[]
  >([]);

  // Activate the function of drawing straight lines
  const { drawStart, cleanUp } = useEnableDrawingLine({
    chart: chart!,
    childSeries,
    drawedLineList,
    setDrawedLineList,
    setLineId_equation,
  });

  const dispatch = useDispatch<AppDispatch>();

  const crosshairMoveHandler = useCallback(
    (param: MouseEventParams<Time>) => {
      if (!selectedSeries) return;
      const data = param.seriesData.get(selectedSeries);

      if (data) dispatch(toggleIsCanGrab(true));
      else dispatch(toggleIsCanGrab(false));

      console.log(data);
    },
    [selectedSeries]
  );

  const chartClickHandler = useCallback(
    (param: MouseEventParams<Time>) => {
      try {
        if (!param.point) return;

        const hoveringSeries = findHoveringSeries(
          childSeries,
          chart!,
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
    },
    [chart, childSeries, lineId_equation]
  );

  useEffect(() => {
    if (!container.current) return;
    setChart(createChart(container.current, defaultChartOptions));

    return () => {
      cleanUp();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.applyOptions({
      handleScale: !isDrawing,
      handleScroll: !isDrawing,
      rightPriceScale: { autoScale: !isDrawing },
    });
  }, [isDrawing]);

  useEffect(() => {
    if (!chart) return;
    chart.subscribeCrosshairMove(throttle(crosshairMoveHandler, 10));
    chart.subscribeClick(chartClickHandler);
  }, [chart, chartClickHandler, crosshairMoveHandler]);

  useImperativeHandle(ref, () => ({
    chart: chart!,
    childSeries: childSeries,
    lineId_equation,
    selectedSeries: selectedSeries!,
    setSelectedSeries,
  }));

  return (
    <div
      className={clsx(
        "relative",
        className,
        isCanGrab && "cursor-grab",
        isDrawing && mousePressing && "cursor-grabbing"
      )}
      ref={container}
      onMouseDown={(e) => (drawable ? drawStart(e, container.current) : null)}
    >
      <ChartContext.Provider
        value={{
          chart,
          setChildSeries,
          selectedSeries,
        }}
      >
        {children}
      </ChartContext.Provider>
    </div>
  );
};

export default forwardRef(TChart);
