import { AppDispatch, RootState } from "@/store";
import { toggleDrawing, toggleMousePressing } from "@/store/commonSlice";
import { calcValue, makeLineData, recordEquation } from "@/utils/helpers";
import { LineData, Time, UTCTimestamp } from "lightweight-charts";
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

  const changeSelectedSeries = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch(toggleDrawing(true));
      dispatch(toggleMousePressing(true));
      // Calculate time and value based on mouse position
      const [time, value, x, y] = calcValue(e, dom, baseSeries, chart);
      // Find invariant point
      const fixedPoint = selectedSeries!
        .data()
        .find(
          (point) =>
            (point.customValues as Record<string, unknown>).isStartPoint !==
            (hoveringPoint?.customValues as Record<string, unknown>)
              .isStartPoint
        ) as LineData<Time>;
      // Calculate dynamic point
      const dynamicPoint: LineData<Time> = {
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y },
      };

      setDynamic(dynamicPoint);
      setFixed(fixedPoint);

      // // Bind events when the mouse move and mouse up
      document.onmousemove = dragMove;
      document.onmouseup = dragEnd;
    },
    [baseSeries, hoveringPoint?.customValues, selectedSeries]
  );

  const dragMove = useCallback(
    (e: MouseEvent) => {
      const [time, value, x, y] = calcValue(e, dom, baseSeries, chart);

      const dynamicPoint: LineData<Time> = {
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y },
      };

      setDynamic(dynamicPoint);
    },
    [baseSeries, chart, dom]
  );

  const cleanUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
    setDynamic(null);
    setFixed(null);
  };

  const dragEnd = () => {
    dispatch(toggleDrawing(false));
    dispatch(toggleMousePressing(false));
    Promise.resolve().then(cleanUp);
  };

  useEffect(() => {
    if (!dynamic || !fixed || !lineId || !selectedSeries) return;

    const lineData = makeLineData(dynamic, fixed, lineId);
    try {
      selectedSeries.setData(lineData);
      recordEquation(
        dynamic.customValues as any,
        fixed.customValues as any,
        lineId,
        setLineId_equation,
        chart!,
        baseSeries
      );
    } catch (error) {}
  }, [
    baseSeries,
    chart,
    dynamic,
    fixed,
    lineId,
    selectedSeries,
    setLineId_equation,
  ]);

  return {
    changeSelectedSeries,
  };
};
