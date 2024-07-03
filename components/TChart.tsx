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
  UTCTimestamp,
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
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TChartRef, TChartProps, IChartContext } from "./interfaces/TChart";
import {
  calcValue,
  Equation,
  findHoveringSeries,
  makeLineData,
} from "@/utils/helpers";
import { setSelectedSeries } from "@/store/commonSlice";

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

  const changeSelectedSeries = useCallback(
    (e: globalThis.MouseEvent) => {
      const [time, value, x, y] = calcValue(
        e,
        container.current,
        childSeries[0],
        chart!
      );

      const fixedPoint = selectedSeries!
        .data()
        .find(
          (point) =>
            (point.customValues as any).isStartPoint !==
            (hoveringPoint?.customValues as any).isStartPoint
        ) as LineData<Time>;

      const dynamicPoint: LineData<Time> = {
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y },
      };
      const lineId = selectedSeries!.options().id;
      const lineData = makeLineData(dynamicPoint, fixedPoint, lineId);
      selectedSeries!.setData(lineData);

      // TODO:鼠标移动和鼠标抬起的时候绑定事件
    },
    [hoveringPoint]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  // 鼠标移动事件 light-weight chart专属
  useEffect(() => {
    if (selectedSeries) {
      const point = mouseMovingEventParam?.seriesData.get(selectedSeries) as
        | LineData<Time>
        | undefined;

      setHoveringPoint(point);
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

export default forwardRef(TChart);
