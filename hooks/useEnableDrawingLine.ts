import { toggleDrawing } from "@/store/commonSlice";
import { Point, calcValue, recordEquation } from "@/utils/helpers";
import { AppDispatch, RootState } from "@/store";
import { LineData, Time, UTCTimestamp } from "lightweight-charts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IEnableDrawingLine } from "./interfaces";

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
  const { isDrawing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();

  const drawStart = (
    mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chartContainer: HTMLDivElement | null
  ) => {
    if (!isDrawing) return;
    if (!chartContainer) throw new Error("Missing DOM");

    const [time, value, x, y] = calcValue(
      mouseEvent,
      chartContainer,
      childSeries[0],
      chart!
    );

    const lineId = `${childSeries[0].options().id}_line_${
      drawedLineList.length + 1
    }`;
    setDrawingLineId(lineId);
    setDrawedLineList([
      ...drawedLineList,
      {
        // title: lineId,
        lastValueVisible: false,
        id: lineId,
      },
    ]);
    setDrawStartPoint({
      value: value as number,
      time: time as UTCTimestamp,
      customValues: { x, y },
    });

    document.onmousemove = (mouseEvent) => drawMove(mouseEvent, chartContainer);
    document.onmouseup = drawEnd;
  };

  const drawMove = (e: MouseEvent, dom: HTMLDivElement | null) => {
    try {
      const [time, value, x, y] = calcValue(e, dom, childSeries[0], chart!);
      setDrawEndPoint({
        value: value as number,
        time: time as UTCTimestamp,
        customValues: { x, y },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const drawEnd = () => {
    dispatch(toggleDrawing(false));
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

    const lineData = [drawStartPoint, drawEndPoint]
      .sort(
        (a, b) =>
          new Date(a.time as string).getTime() -
          new Date(b.time as string).getTime()
      )
      .map((point, index) => ({
        ...point,
        customValues: {
          ...point.customValues,
          id: drawingLineId,
          isStartPoint: index === 0,
        },
      }));

    try {
      drawingSeries.setData(lineData);
      recordEquation(
        drawStartPoint.customValues! as Point,
        drawEndPoint.customValues! as Point,
        drawingLineId,
        setLineId_equation
      );
    } catch (error) {}
  }, [childSeries, drawingLineId, drawStartPoint, drawEndPoint]);

  return { drawStart, cleanUp };
};
