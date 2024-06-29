import { toggleDrawing } from "@/store/commonSlice";
import { calcValue } from "@/utils/helpers";
import { AppDispatch, RootState } from "@/store";
import {
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  LineStyleOptions,
  SeriesOptionsCommon,
  SeriesType,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IEnableDrawingLine {
  childSeries: ISeriesApi<SeriesType, Time>[];
  chart: IChartApi;
  drawedLineList: LineSeriesPartialOptions[];
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
}

// Use for activating the function of drawing straight lines
export const useEnableDrawingLine = ({
  childSeries,
  chart,
  drawedLineList,
  setDrawedLineList,
}: IEnableDrawingLine) => {
  const [drawStartPoint, setDrawStartPoint] = useState<LineData<Time> | null>(
    null
  );
  const [drawEndPoint, setDrawEndPoint] = useState<LineData<Time> | null>(null);
  const [drawingLineTitle, setDrawingLineTitle] = useState("");
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

    console.log("drawStart function");

    const lineId = `${childSeries[0].options().title}_line_${
      drawedLineList.length + 1
    }`;
    setDrawingLineTitle(lineId);
    setDrawedLineList([...drawedLineList, { title: lineId }]);
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
    setDrawingLineTitle("");
  };

  useEffect(() => {
    // find drawing line series from child series pool
    if (!drawingLineTitle) return;
    const drawingSeries = childSeries.find(
      (child) => child.options().title === drawingLineTitle
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
          id: drawingLineTitle,
          isStartPoint: index === 0,
        },
      }));
    try {
      drawingSeries.setData(lineData);
    } catch (error) {}
  }, [childSeries, drawingLineTitle, drawStartPoint, drawEndPoint]);

  return { drawStart, cleanUp };
};
