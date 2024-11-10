import { AppDispatch, RootState } from "@/store";
import {
  setGraphType,
  toggleDrawing,
  toggleMousePressing,
} from "@/store/commonSlice";
import {
  calcValue,
  findClosestPrice,
  makeLineData,
  recordEquation,
} from "@/utils/helpers";
import {
  CandlestickData,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDragLineSeries } from "./interfaces";

export const useDragLineSeries = ({
  dom,
  baseSeries,
  chart,
  hoveringPoint,
  setLineId_equation,
}: IDragLineSeries) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSeries, mouseMovingEventParam } = useSelector(
    (state: RootState) => state.common
  );
  const [dynamic, setDynamic] = useState<LineData<Time> | null>(null);
  const [fixed, setFixed] = useState<LineData<Time> | null>(null);
  const lineId = useMemo(() => selectedSeries?.options().id, [selectedSeries]);
  const { avgAmplitude } = useSelector((state: RootState) => state.fetchData);

  const changeSelectedSeries = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!selectedSeries) return;
      dispatch(toggleDrawing(true));
      dispatch(toggleMousePressing(true));
      // Find invariant point
      const fixedPoint = selectedSeries
        .data()
        .find(
          (point) =>
            (point.customValues as Record<string, unknown>).isStartPoint !==
            (hoveringPoint?.customValues as Record<string, unknown>)
              .isStartPoint
        ) as LineData<Time>;

      setFixed(fixedPoint);

      // // Bind events when the mouse move and mouse up
      document.onmousemove = dragMove;
      document.onmouseup = dragEnd;
    },
    [baseSeries, hoveringPoint?.customValues, selectedSeries]
  );

  const dragMove = useCallback(
    (e: MouseEvent) => {
      const [time, value, x, y, logic] = calcValue(e, dom, baseSeries, chart);

      const dynamicPoint: LineData<Time> = {
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y, logic, price: value },
      };

      setDynamic(dynamicPoint);
    },
    [baseSeries]
  );

  const cleanUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
    setDynamic(null);
    setFixed(null);
  };

  const dragEnd = (e: MouseEvent) => {
    dispatch(toggleDrawing(false));
    dispatch(setGraphType(""));
    dispatch(toggleMousePressing(false));
    Promise.resolve().then(cleanUp);
  };

  useEffect(() => {
    if (!dynamic || !fixed || !lineId || !selectedSeries) return;

    const currentCandlestick = mouseMovingEventParam?.seriesData.get(
      baseSeries
    ) as CandlestickData<Time>;

    const cloest = findClosestPrice(
      dynamic.value,
      currentCandlestick
        ? [
            currentCandlestick.open,
            currentCandlestick.high,
            currentCandlestick.low,
            currentCandlestick.close,
          ]
        : [],
      avgAmplitude!
    );

    const lineData = cloest
      ? makeLineData(
          {
            ...dynamic,
            value: cloest!,
            customValues: {
              ...dynamic.customValues,
              price: cloest,
            },
          },
          fixed,
          lineId
        )
      : makeLineData(dynamic, fixed, lineId);

    try {
      selectedSeries.setData(lineData);
      recordEquation(
        fixed.customValues as any,
        dynamic.customValues as any,
        lineId,
        setLineId_equation,
        chart!
      );
    } catch (error) {}
  }, [dynamic, fixed, lineId, selectedSeries, mouseMovingEventParam]);

  return {
    changeSelectedSeries,
    cleanUp,
  };
};
