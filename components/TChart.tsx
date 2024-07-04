"use client";
import { defaultChartOptions } from "@/constants/chartOptions";
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
import { setSelectedSeries } from "@/store/commonSlice";
import { useDragLineSeries } from "@/hooks/useDragLineSeries";

export const ChartContext = createContext<IChartContext>({});

const TChart: React.ForwardRefRenderFunction<
  TChartRef,
  PropsWithChildren<TChartProps>
> = (
  { children, className, setDrawedLineList, drawable = true, drawedLineList },
  ref
) => {
  const container = useRef<HTMLDivElement>(null);
  const {
    isDrawing,
    mouseMovingEventParam,
    mouseClickEventParam,
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

  const [hoveringPoint, setHoveringPoint] = useState<
    LineData<Time> | undefined
  >();
  const isCanGrab = useMemo<boolean>(() => !!hoveringPoint, [hoveringPoint]);
  const dispatch = useDispatch<AppDispatch>();

  // Activate the function of drawing straight lines
  const { drawStart, cleanUp } = useEnableDrawingLine({
    chart: chart!,
    childSeries,
    drawedLineList,
    setDrawedLineList,
    setLineId_equation,
  });
  //  Activate the function of draging lines
  const { changeSelectedSeries } = useDragLineSeries({
    dom: container.current!,
    baseSeries: childSeries[0],
    chart: chart!,
    hoveringPoint,
    setLineId_equation,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  // 鼠标移动事件 light-weight chart专属
  useEffect(() => {
    if (selectedSeries) {
      const point = mouseMovingEventParam?.seriesData.get(selectedSeries) as
        | LineData<Time>
        | undefined;

      setHoveringPoint(point);
    } else {
      if (container.current!.onmousedown) container.current!.onmousedown = null;
    }
  }, [mouseMovingEventParam, selectedSeries]);

  // 鼠标点击事件 light-weight chart专属
  useEffect(() => {
    try {
      if (!mouseClickEventParam?.point || !chart) return;
      const hoveringSeries = findHoveringSeries(
        childSeries,
        chart,
        lineId_equation,
        mouseClickEventParam.point
      );
      if (hoveringSeries) {
        dispatch(setSelectedSeries(hoveringSeries));
      } else {
        dispatch(setSelectedSeries(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [mouseClickEventParam]);

  useEffect(() => {
    if (hoveringPoint) {
      container.current!.onmousedown = changeSelectedSeries;
    } else {
      container.current!.onmousedown = null;
    }
  }, [hoveringPoint]);

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
        isDrawing && mousePressing && "cursor-grabbing"
      )}
      ref={container}
      // Only unselected series can trigger the line drawing function
      onMouseDown={(e) =>
        drawable && !selectedSeries ? drawStart(e, container.current) : null
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
