"use client";
import {
  darkModeOptions,
  defaultChartOptions,
  lightModeOptions,
} from "@/constants/chartOptions";
import { useEnableDrawingLine } from "@/hooks/useEnableDrawingLine";
import { AppDispatch, RootState } from "@/store";
import clsx from "clsx";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
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
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TChartRef, TChartProps, IChartContext } from "./interfaces/TChart";
import { Equation, findHoveringSeries } from "@/utils/helpers";
import { setHoveringSeries, setSelectedSeries } from "@/store/commonSlice";
import { useDragLineSeries } from "@/hooks/useDragLineSeries";
import { useTheme } from "next-themes";
import theme from "tailwindcss/defaultTheme";

export const ChartContext = createContext<IChartContext>({});

const TChart: React.ForwardRefRenderFunction<
  TChartRef,
  PropsWithChildren<TChartProps>
> = (
  { children, className, setDrawedLineList, drawedLineList, dialogTrigger },
  ref
) => {
  const container = useRef<HTMLDivElement>(null);
  const {
    isDrawing,
    mouseMovingEventParam,
    mouseClickEventParam,
    mouseDblClickEventParam,
    mousePressing,
    selectedSeries,
  } = useSelector((state: RootState) => state.common);
  const [chart, setChart] = useState<IChartApi>();
  const [lineId_equation, setLineId_equation] = useState<
    Record<string, Equation>
  >({});
  // Collection of series instances for all children components
  const [childSeries, setChildSeries] = useState<
    ISeriesApi<SeriesType, Time>[]
  >([]);

  const [hoveringPoint, setHoveringPoint] = useState<LineData<Time> | null>(
    null
  );
  const isCanGrab = useMemo<boolean>(() => !!hoveringPoint, [hoveringPoint]);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();

  // Activate the function of drawing straight lines
  const { drawStart, cleanUp: cleanUp1 } = useEnableDrawingLine({
    chart: chart!,
    childSeries,
    drawedLineList,
    setDrawedLineList,
    setLineId_equation,
  });
  //  Activate the function of draging lines
  const { changeSelectedSeries, cleanUp: cleanUp2 } = useDragLineSeries({
    dom: container.current!,
    baseSeries: childSeries[0],
    chart: chart!,
    hoveringPoint: hoveringPoint!,
    setLineId_equation,
  });

  useEffect(() => {
    if (!container.current) return;

    setChart(createChart(container.current, defaultChartOptions));

    return () => {
      cleanUp1();
      cleanUp2();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  // Mouse movement event (exclusive to light weight chart)
  useEffect(() => {
    if (!chart) return;

    if (selectedSeries) {
      const point = mouseMovingEventParam?.seriesData.get(
        selectedSeries
      ) as LineData<Time> | null;

      if (point) setHoveringPoint(point);
      else setHoveringPoint(null);
    }

    const hoveringSeries = findHoveringSeries(
      childSeries,
      chart,
      lineId_equation,
      mouseMovingEventParam?.point!
    );

    if (hoveringSeries) {
      dispatch(setHoveringSeries(hoveringSeries));
    } else {
      dispatch(setHoveringSeries(null));
    }
  }, [mouseMovingEventParam, selectedSeries]);

  // Mouse click events (exclusive to light weight chart)
  useEffect(() => {
    if (!mouseClickEventParam?.point || !chart) return;
    // Find out if the series was hit by a mouse click
    const hoveringSeries = findHoveringSeries(
      childSeries,
      chart,
      lineId_equation,
      mouseClickEventParam.point!
    );

    if (hoveringSeries) {
      dispatch(setSelectedSeries(hoveringSeries));
    } else {
      dispatch(setSelectedSeries(null));
    }
  }, [mouseClickEventParam]);

  // Mouse double click events (exclusive to light weight chart)
  useEffect(() => {
    if (!selectedSeries || !dialogTrigger) return;
    dialogTrigger.click();
  }, [mouseDblClickEventParam]);

  // toggle light or dark mode
  useEffect(() => {
    if (!chart) return;
    if (theme === "light") {
      chart.applyOptions(lightModeOptions);
    } else {
      chart.applyOptions(darkModeOptions);
    }
  }, [chart, theme]);

  useImperativeHandle(ref, () => ({
    chart: chart!,
    childSeries: childSeries,
  }));

  return (
    <div
      className={clsx(
        "relative",
        className,
        isCanGrab && "cursor-grab",
        mousePressing && "cursor-grabbing",
        isDrawing && !mousePressing && "cursor-crosshair"
      )}
      ref={container}
      // Only unselected series can trigger the line drawing function
      onMouseDown={(e) =>
        hoveringPoint
          ? changeSelectedSeries(e)
          : drawStart(e, container.current)
      }
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

export default forwardRef(TChart);
