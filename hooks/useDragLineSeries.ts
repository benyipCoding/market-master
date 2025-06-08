import { AppDispatch, RootState } from "@/store";
import {
  selectCanMoveOrderPriceLine,
  selectHoveredObjectId,
  selectIsHoveringLossOrProfit,
  setGraphType,
  setSelectedSeries,
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
  ISeriesApi,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDragLineSeries } from "./interfaces";
import { EmitteryContext, OnPriceLine } from "@/providers/EmitteryProvider";
import { UpdatePriceLinePayload } from "@/components/interfaces/CandlestickSeries";

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
  const isHoveringLossOrProfit = useSelector((state: RootState) =>
    selectIsHoveringLossOrProfit(state)
  );
  const canMoveOrderPriceLine = useSelector((state: RootState) =>
    selectCanMoveOrderPriceLine(state)
  );

  const hoveredObjectId = useSelector((state: RootState) =>
    selectHoveredObjectId(state)
  );
  const { emittery } = useContext(EmitteryContext);

  const changeSelectedSeries = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch(toggleDrawing(true));
      dispatch(toggleMousePressing(true));

      if (selectedSeries && !isHoveringLossOrProfit && !canMoveOrderPriceLine) {
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
      }

      // Bind events when the mouse move and mouse up
      document.onmousemove = dragMove;
      document.onmouseup = dragEnd;
    },
    [
      selectedSeries,
      isHoveringLossOrProfit,
      canMoveOrderPriceLine,
      hoveringPoint?.customValues,
    ]
  );

  const dragMove = useCallback(
    (e: MouseEvent) => {
      const [time, value, x, y, logic] = calcValue(e, dom, baseSeries, chart);
      if (isHoveringLossOrProfit || canMoveOrderPriceLine) {
        // 如果是拖动priceLine
        dispatch(setSelectedSeries(null));

        const payload: UpdatePriceLinePayload = {
          id: hoveredObjectId as string,
          options: {
            price: value as number,
          },
        };
        emittery?.emit(OnPriceLine.updatePanel, payload);
        emittery?.emit(OnPriceLine.update, payload);
      } else if (selectedSeries) {
        // 如果是自定义画线
        const dynamicPoint: LineData<Time> = {
          value: value as number,
          time: time as UTCTimestamp,
          customValues: { x, y, logic, price: value },
        };

        setDynamic(dynamicPoint);
      }
    },
    [
      baseSeries,
      isHoveringLossOrProfit,
      selectedSeries,
      hoveredObjectId,
      canMoveOrderPriceLine,
    ]
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
    emittery?.emit(OnPriceLine.dragEnd);
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
