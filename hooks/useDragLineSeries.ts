import { AppDispatch, RootState } from "@/store";
import { toggleDrawing, toggleMousePressing } from "@/store/commonSlice";
import { calcValue, makeLineData, recordEquation } from "@/utils/helpers";
import { LineData, Time, UTCTimestamp } from "lightweight-charts";
import { useCallback, useEffect, useMemo } from "react";
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

  const changeSelectedSeries = useCallback(
    (e: globalThis.MouseEvent) => {
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
      const lineId = selectedSeries!.options().id;
      const lineData = makeLineData(dynamicPoint, fixedPoint, lineId);
      // Rendering line
      selectedSeries!.setData(lineData);

      // Bind events when the mouse move and mouse up
      document.onmousemove = (e) => dragMove(e, fixedPoint);
      document.onmouseup = dragEnd;
    },
    [hoveringPoint]
  );

  const dragMove = useCallback(
    (e: MouseEvent, fixedPoint: LineData<Time>) => {
      const [time, value, x, y] = calcValue(e, dom, baseSeries, chart);

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
          dynamicPoint.customValues as any,
          fixedPoint.customValues as any,
          lineId,
          setLineId_equation,
          chart!,
          baseSeries
        );
      } catch (error) {}
    },
    [selectedSeries, setLineId_equation]
  );

  const dragEnd = () => {
    dispatch(toggleDrawing(false));
    dispatch(toggleMousePressing(false));
    Promise.resolve().then(() => {
      document.onmousemove = null;
      document.onmouseup = null;
    });
  };

  // useEffect(() => {
  //   console.log(mouseMovingEventParam?.seriesData.get(baseSeries));
  // }, [mouseMovingEventParam?.seriesData.get(baseSeries)]);

  return {
    changeSelectedSeries,
  };
};
