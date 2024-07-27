import { toggleDrawing, toggleMousePressing } from "@/store/commonSlice";
import {
  Point,
  calcValue,
  findClosestPrice,
  makeLineData,
  recordEquation,
} from "@/utils/helpers";
import { AppDispatch, RootState } from "@/store";
import {
  CandlestickData,
  LineData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomLineSeriesType, IEnableDrawingLine } from "./interfaces";

// Use for activating the function of drawing straight lines
export const useEnableDrawingLine = ({
  childSeries,
  chart,
  drawedLineList,
  setDrawedLineList,
  setLineId_equation,
}: IEnableDrawingLine) => {
  const [drawStartPoint, setDrawStartPoint] = useState<LineData<Time> | null>(
    null
  );
  const [drawEndPoint, setDrawEndPoint] = useState<LineData<Time> | null>(null);
  const [drawingLineId, setDrawingLineId] = useState("");
  const { isDrawing, mouseMovingEventParam } = useSelector(
    (state: RootState) => state.common
  );
  const dispatch = useDispatch<AppDispatch>();

  const drawStart = (
    mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chartContainer: HTMLDivElement | null
  ) => {
    if (!isDrawing || mouseEvent.button === 2) return; // Function return when mouse right click.
    if (!chartContainer) throw new Error("Missing DOM");

    const [time, value, x, y, logic] = calcValue(
      mouseEvent,
      chartContainer,
      childSeries[0],
      chart!
    );

    const lineId = `${childSeries[0].options().id}_line_${Date.now()}`;
    setDrawingLineId(lineId);
    setDrawedLineList([
      ...drawedLineList,
      {
        id: lineId,
        showLabel: false,
        customTitle: "",
        customType: CustomLineSeriesType.Drawed,
      },
    ]);

    const currentCandlestick = mouseMovingEventParam?.seriesData.get(
      childSeries[0]
    ) as CandlestickData<Time>;

    const refecences = currentCandlestick
      ? [
          currentCandlestick.open,
          currentCandlestick.high,
          currentCandlestick.low,
          currentCandlestick.close,
        ]
      : [];

    const cloestStart = findClosestPrice(value as number, refecences);

    setDrawStartPoint({
      value: cloestStart || (value as number),
      time: time as UTCTimestamp,
      customValues: {
        x,
        y,
        logic,
        price: cloestStart || value,
      },
    });

    dispatch(toggleMousePressing(true));
    document.onmousemove = (mouseEvent) => drawMove(mouseEvent, chartContainer);
    document.onmouseup = drawEnd;
  };

  const drawMove = (e: MouseEvent, dom: HTMLDivElement | null) => {
    try {
      const [time, value, x, y, logic] = calcValue(
        e,
        dom,
        childSeries[0],
        chart!
      );
      setDrawEndPoint({
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y, logic, price: value },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const drawEnd = () => {
    dispatch(toggleDrawing(false));
    dispatch(toggleMousePressing(false));
    Promise.resolve().then(cleanUp);
  };

  const cleanUp = () => {
    document.onmousemove = null;
    document.onmouseup = null;
    setDrawStartPoint(null);
    setDrawEndPoint(null);
    setDrawingLineId("");
  };

  useEffect(() => {
    // find drawing line series from child series pool
    if (!drawingLineId) return;
    const drawingSeries = childSeries.find(
      (child) => child.options().id === drawingLineId
    );
    // draw the line
    if (!drawingSeries || !drawStartPoint || !drawEndPoint) return;

    const currentCandlestick = mouseMovingEventParam?.seriesData.get(
      childSeries[0]
    ) as CandlestickData<Time>;

    const refecences = currentCandlestick
      ? [
          currentCandlestick.open,
          currentCandlestick.high,
          currentCandlestick.low,
          currentCandlestick.close,
        ]
      : [];

    const cloestEnd = findClosestPrice(drawEndPoint.value, refecences);

    const lineData = cloestEnd
      ? makeLineData(
          drawStartPoint,
          {
            ...drawEndPoint,
            value: cloestEnd,
            customValues: {
              ...drawEndPoint.customValues,
              price: cloestEnd,
            },
          },
          drawingLineId
        )
      : makeLineData(drawStartPoint, drawEndPoint, drawingLineId);

    if (!lineData || !lineData.length) return;

    try {
      drawingSeries.setData(lineData);
      recordEquation(
        drawStartPoint.customValues! as Point,
        drawEndPoint.customValues! as Point,
        drawingLineId,
        setLineId_equation,
        chart
      );
    } catch (error) {}
  }, [
    childSeries,
    drawingLineId,
    drawStartPoint,
    drawEndPoint,
    mouseMovingEventParam,
  ]);

  return { drawStart, cleanUp };
};
