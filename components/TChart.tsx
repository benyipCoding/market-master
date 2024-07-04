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
  Point,
  recordEquation,
} from "@/utils/helpers";
import {
  setSelectedSeries,
  toggleDrawing,
  toggleMousePressing,
} from "@/store/commonSlice";

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

  const dragMove = (e: MouseEvent, fixedPoint: LineData<Time>) => {
    const [time, value, x, y] = calcValue(
      e,
      container.current,
      childSeries[0],
      chart!
    );

    const dynamicPoint: LineData<Time> = {
      value: value as number,
      time: time as UTCTimestamp,
      customValues: { x, y },
    };

    const lineId = selectedSeries!.options().id;

    const lineData = makeLineData(dynamicPoint, fixedPoint, lineId);

    try {
      selectedSeries!.setData(lineData);
      recordEquation(
        dynamicPoint.customValues as Point,
        fixedPoint.customValues as Point,
        lineId,
        setLineId_equation,
        chart!,
        childSeries[0]
      );
    } catch (error) {}
  };

  const dragEnd = () => {
    dispatch(toggleDrawing(false));
    dispatch(toggleMousePressing(false));
    Promise.resolve().then(() => {
      document.onmousemove = null;
      document.onmouseup = null;
    });
  };

  const changeSelectedSeries = useCallback(
    (e: globalThis.MouseEvent) => {
      dispatch(toggleDrawing(true));
      dispatch(toggleMousePressing(true));
      // 根据鼠标位置计算time和value
      const [time, value, x, y] = calcValue(
        e,
        container.current,
        childSeries[0],
        chart!
      );
      // 找到不变的点
      const fixedPoint = selectedSeries!
        .data()
        .find(
          (point) =>
            (point.customValues as Record<string, unknown>).isStartPoint !==
            (hoveringPoint?.customValues as Record<string, unknown>)
              .isStartPoint
        ) as LineData<Time>;
      // 计算动态的点
      const dynamicPoint: LineData<Time> = {
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y },
      };
      const lineId = selectedSeries!.options().id;
      const lineData = makeLineData(dynamicPoint, fixedPoint, lineId);
      // 渲染直线
      selectedSeries!.setData(lineData);

      // 鼠标移动和鼠标抬起的时候绑定事件
      document.onmousemove = (e) => dragMove(e, fixedPoint);
      document.onmouseup = dragEnd;
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
