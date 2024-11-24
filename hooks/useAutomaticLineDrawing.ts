import {
  CandlestickData,
  ISeriesApi,
  Point,
  SeriesType,
  Time,
} from "lightweight-charts";
import {
  AutomaticLineDrawingArgs,
  AutomaticLinePoint,
  CustomLineSeriesType,
  LineState,
  TrendType,
} from "./interfaces";
import {
  calcCoordinate,
  makeLineData,
  recordEquationHandler,
} from "@/utils/helpers";
import { useContext, useEffect, useMemo, useState } from "react";
import { EmitteryContext, OnSeriesCreate } from "@/providers/EmitteryProvider";
import { SeriesColors } from "@/constants/seriesOptions";

export const useAutomaticLineDrawing = ({
  setDrawedLineList,
  tChartRef,
}: AutomaticLineDrawingArgs) => {
  const { emittery } = useContext(EmitteryContext);
  const [addtionalSeries, setAddtionalSeries] = useState<ISeriesApi<
    SeriesType,
    Time
  > | null>(null);
  const [canNext, setCanNext] = useState(true);
  const [lineList, setLineList] = useState<Array<LineState>>([]);
  const iterator = useMemo(() => lineList[Symbol.iterator](), [lineList]);
  const [lineValue, setLineValue] = useState<LineState | null>(null);
  const [autoDrawing, setAutoDrawing] = useState(false);
  const [lineSeriesRecord, setLineSeriesRecord] = useState<
    ISeriesApi<"Line", Time>[]
  >([]);

  const generateLinePoint = (time: Time, price: number) => {
    const { x, y, logic } = calcCoordinate({
      time,
      price,
      series: tChartRef.current?.childSeries[0]!,
      chart: tChartRef.current?.chart!,
    });

    return {
      value: price,
      time,
      customValues: { x, y, logic, price },
    };
  };

  const generateLineData = (
    startPoint: AutomaticLinePoint,
    endPoint: AutomaticLinePoint,
    lineId: string
  ) => {
    // 起始点
    const lineStart = generateLinePoint(startPoint.time, startPoint.price);
    // 结束点
    const lineEnd = generateLinePoint(endPoint.time, endPoint.price);

    return makeLineData(lineStart, lineEnd, lineId);
  };

  const performDrawing = (drawAction: boolean = false) => {
    if (!tChartRef.current) return;
    const candlestickData =
      tChartRef.current.childSeries[0].data() as CandlestickData<Time>[];

    const high: AutomaticLinePoint = {
      index: 0,
      price: Math.max(candlestickData[0].open, candlestickData[0].close),
      time: candlestickData[0].time as Time,
    };
    const low: AutomaticLinePoint = {
      index: 0,
      price: Math.min(candlestickData[0].open, candlestickData[0].close),
      time: candlestickData[0].time as Time,
    };

    let currentTrend: TrendType | null = null;
    let startPoint: AutomaticLinePoint | null;
    let endPoint: AutomaticLinePoint | null;
    const lines: Array<LineState> = [];

    const updateLowOrHigh = (
      newTrend: TrendType,
      currentHigh: number,
      currentLow: number,
      index: number,
      candle: CandlestickData<Time>
    ) => {
      newTrend === TrendType.Up && (low.index = index);
      newTrend === TrendType.Up && (low.price = currentLow);
      newTrend === TrendType.Up && (low.time = candle.time);

      newTrend === TrendType.Down && (high.index = index);
      newTrend === TrendType.Down && (high.price = currentHigh);
      newTrend === TrendType.Down && (high.time = candle.time);
    };

    const updateTrend = (
      newTrend: TrendType,
      currentHigh: number,
      currentLow: number,
      index: number,
      candle: CandlestickData<Time>,
      kCount: number = 5
    ) => {
      let diff: number = 0;

      if (currentTrend === newTrend) {
        // 趋势延续
        diff =
          newTrend === TrendType.Up
            ? Math.abs(
                high.index! - (startPoint ? startPoint.index! : low.index!)
              ) + 1
            : Math.abs(
                (startPoint ? startPoint.index! : high.index!) - low.index!
              ) + 1;

        if (diff >= kCount) {
          endPoint = newTrend === TrendType.Up ? { ...high } : { ...low };

          updateLowOrHigh(newTrend, currentHigh, currentLow, index, candle);
        }
      } else {
        // 趋势改变或初始化
        diff =
          newTrend === TrendType.Up
            ? Math.abs(
                high.index! - (endPoint ? endPoint.index! : low.index!)
              ) + 1
            : Math.abs(
                (endPoint ? endPoint.index! : high.index!) - low.index!
              ) + 1;
        if (diff >= kCount) {
          // 结算前一个相反趋势线
          if (startPoint && endPoint) {
            lines.push({
              startPoint,
              endPoint,
              trend: currentTrend || newTrend,
              type: CustomLineSeriesType.AutomaticDrawed,
            });
          }

          currentTrend = newTrend;

          startPoint = newTrend === TrendType.Up ? { ...low } : { ...high };
          endPoint = newTrend === TrendType.Up ? { ...high } : { ...low };

          updateLowOrHigh(newTrend, currentHigh, currentLow, index, candle);
        }
      }
    };

    candlestickData.forEach((candle, index) => {
      if (index === 0) return;
      const currentHigh = Math.max(candle.open, candle.close);
      const currentLow = Math.min(candle.open, candle.close);

      if (currentHigh > high.price) {
        // 高位刷新时
        high.index = index;
        high.price = currentHigh;
        high.time = candle.time;
        updateTrend(TrendType.Up, currentHigh, currentLow, index, candle);
      }

      if (currentLow < low.price) {
        // 低位刷新时
        low.index = index;
        low.price = currentLow;
        low.time = candle.time;
        updateTrend(TrendType.Down, currentHigh, currentLow, index, candle);
      }
    });

    drawAction && setLineList(lines);
    return lines;
  };

  const drawSegment = () => {
    const segmentList = generateLineSegment2(
      lineList.length ? lineList : performDrawing()!
    );

    setLineList(segmentList);
  };

  // 辅助函数
  const canDrawSegment2 = (
    rootLine: LineState,
    rootIndex: number,
    lineList: LineState[]
  ): number | undefined => {
    let reference: LineState = rootLine;
    let endIndex: number | undefined = undefined;
    let isFirstTime = true;

    for (let i = rootIndex + 2; i < lineList.length; i += 2) {
      const currentTrend = reference.trend;
      const currentStartPrice = reference.startPoint.price;
      const currentEndPrice = reference.endPoint.price;
      const prevLine = lineList[rootIndex - 1];

      const nextSameTrendLine = lineList[i];
      const nextStartPrice = nextSameTrendLine.startPoint.price;
      const nextEndPrice = nextSameTrendLine.endPoint.price;

      // 1. 趋势不可能持续的情况
      const canNotGrow =
        rootLine.trend === TrendType.Up
          ? nextStartPrice < rootLine.startPoint.price
          : nextStartPrice > rootLine.startPoint.price;
      if (canNotGrow) {
        return endIndex;
      }

      if (endIndex) {
        const nextReverseLine = lineList[i - 1];
        const res = canDrawSegment2(nextReverseLine, i - 1, lineList);
        if (res) {
          return endIndex;
        }
      }

      // 2. 可持续情况一
      const canGrow1 =
        currentTrend === TrendType.Up
          ? (nextStartPrice > currentStartPrice ||
              nextStartPrice > rootLine.startPoint.price) &&
            nextEndPrice > currentEndPrice
          : (nextStartPrice < currentStartPrice ||
              nextStartPrice < rootLine.startPoint.price) &&
            nextEndPrice < currentEndPrice;

      if (canGrow1) {
        endIndex = i;
        reference = lineList[i];
        isFirstTime = false;
        continue;
      }

      // 3. 可持续情况二
      if (!prevLine || !isFirstTime) continue;
      const prevStartPrice = prevLine.startPoint.price;
      const canGrow2 =
        currentTrend === TrendType.Up
          ? currentEndPrice > prevStartPrice && nextEndPrice > prevStartPrice
          : currentEndPrice < prevStartPrice && nextEndPrice < prevStartPrice;
      if (canGrow2) {
        endIndex = i;
        reference = lineList[i];
        isFirstTime = false;
        continue;
      }
    }
  };

  const generateLineSegment2 = (
    lineList: LineState[],
    type: CustomLineSeriesType = CustomLineSeriesType.SegmentDrawed
  ): LineState[] => {
    const segmentList: LineState[] = [];

    for (let i = 0; i < lineList.length; i++) {
      const line = lineList[i];
      const endIndex = canDrawSegment2(line, i, lineList);
      if (!endIndex) continue;

      segmentList.push({
        startPoint: line.startPoint,
        endPoint: lineList[endIndex].endPoint,
        trend: line.trend,
        type,
      });

      i = endIndex;
    }

    // return fixGap(segmentList);
    return segmentList;
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
    console.log("lineSeriesCreatedHandler");
    setAddtionalSeries(series);
  };

  const deleteLines = (type: CustomLineSeriesType) => {
    if (!tChartRef.current) return;

    const needToRemoveLines = lineSeriesRecord.filter(
      (series) => series.options().customType === type
    );
    setLineSeriesRecord((prev) =>
      prev.filter((series) => series.options().customType !== type)
    );

    needToRemoveLines.forEach((series) => {
      const id = series.options().id;
      setDrawedLineList((prev) => prev.filter((option) => option.id !== id));
      tChartRef.current!.setLineId_equation((prev) => {
        const newObj = { ...prev };
        delete newObj[id];
        return newObj;
      });

      tChartRef.current!.chart.removeSeries(series);
    });
  };

  const fixGap = (lineList: LineState[]): LineState[] => {
    const fixedLineList: LineState[] = [];
    let dynamicEndPointTime: any = null;
    for (let i = 2; i < lineList.length - 2; i++) {
      const prevLine2 = lineList[i - 2];
      const prevLine = lineList[i - 1];
      const currentLine = lineList[i];
      const nextLine = lineList[i + 1];
      const nextLine2 = lineList[i + 2];

      if (
        dynamicEndPointTime &&
        currentLine.startPoint.time < dynamicEndPointTime
      )
        continue;

      // 1. 下两条相邻线同向
      if (nextLine.trend === nextLine2.trend) {
        const trend = nextLine.trend;
        const fixedCurrentLine: LineState =
          trend === TrendType.Up
            ? {
                ...currentLine,
                endPoint: {
                  ...currentLine.endPoint,
                  price: Math.min(
                    nextLine.startPoint.price,
                    nextLine2.startPoint.price
                  ),
                  time: [nextLine, nextLine2].sort(
                    (a, b) => a.startPoint.price - b.startPoint.price
                  )[0].startPoint.time,
                },
              }
            : {
                ...currentLine,
                endPoint: {
                  ...currentLine.endPoint,
                  price: Math.max(
                    nextLine.startPoint.price,
                    nextLine2.startPoint.price
                  ),
                  time: [nextLine, nextLine2].sort(
                    (a, b) => a.startPoint.price - b.startPoint.price
                  )[1].startPoint.time,
                },
              };
        fixedLineList.push(fixedCurrentLine);
        dynamicEndPointTime = fixedCurrentLine.endPoint.time;
        continue;
      }

      // 2. 前两条线同向
      if (prevLine.trend === prevLine2.trend) {
        const trend = prevLine.trend;
        const fixedCurrentLine: LineState =
          trend === TrendType.Up
            ? {
                ...currentLine,
                startPoint: {
                  ...currentLine.startPoint,
                  price: Math.max(
                    prevLine.endPoint.price,
                    prevLine2.endPoint.price
                  ),
                  time: [prevLine, prevLine2].sort(
                    (a, b) => a.endPoint.price - b.endPoint.price
                  )[1].endPoint.time,
                },
              }
            : {
                ...currentLine,
                startPoint: {
                  ...currentLine.startPoint,
                  price: Math.min(
                    prevLine.endPoint.price,
                    prevLine2.endPoint.price
                  ),
                  time: [prevLine, prevLine2].sort(
                    (a, b) => a.endPoint.price - b.endPoint.price
                  )[0].endPoint.time,
                },
              };

        fixedLineList.pop();
        fixedLineList.push(fixedCurrentLine);
        dynamicEndPointTime = fixedCurrentLine.endPoint.time;
        continue;
      }

      // 正常情况
      fixedLineList.push({ ...currentLine });
      dynamicEndPointTime = currentLine.endPoint.time;
    }

    return fixedLineList;
  };

  useEffect(() => {
    if (!addtionalSeries) return;
    try {
      setLineSeriesRecord((prev) => [
        ...prev,
        addtionalSeries as ISeriesApi<"Line", Time>,
      ]);
      const lineData = generateLineData(
        lineValue?.startPoint!,
        lineValue?.endPoint!,
        addtionalSeries.options().id
      );

      addtionalSeries.setData(lineData);
      recordEquationHandler(
        lineData[0].customValues! as unknown as Point,
        lineData[1].customValues! as unknown as Point,
        addtionalSeries.options().id,
        tChartRef.current!.setLineId_equation,
        tChartRef.current!.chart
      );

      setTimeout(() => setCanNext(true), 50);
    } catch (error) {
      console.log(error);
    }
  }, [addtionalSeries]);

  useEffect(() => {
    if (!canNext || !lineList.length || !tChartRef.current) return;

    setCanNext(() => false);
    setAutoDrawing(true);

    try {
      const { done, value } = iterator.next();
      if (done) {
        setCanNext(true);
        setAddtionalSeries(null);
        setAutoDrawing(false);
        setLineList([]);
        return;
      }
      setLineValue(value);
      const mainSeries = tChartRef.current.childSeries[0];
      const lineId = `${mainSeries.options().id}_line_${Date.now()}`;

      const lineOption = {
        id: lineId,
        showLabel: false,
        customTitle: "",
        customType: value.type,
        color:
          value.type === CustomLineSeriesType.SegmentDrawed
            ? SeriesColors.find((color) => color.label === "green")?.value
            : value.type === CustomLineSeriesType.GreatSegmentDrawed
            ? SeriesColors.find((color) => color.label === "orange")?.value
            : SeriesColors.find((color) => color.label === "yellow")?.value,
      };

      setDrawedLineList((prev) => [...prev, lineOption]);
    } catch (error) {
      console.log(error);
    }
  }, [canNext, iterator]);

  useEffect(() => {
    emittery?.on(OnSeriesCreate.LineSeries, lineSeriesCreatedHandler);

    return () => {
      emittery?.off(OnSeriesCreate.LineSeries, lineSeriesCreatedHandler);
    };
  }, []);

  return {
    performDrawing,
    drawSegment,
    autoDrawing,
    deleteLines,
    generateLineSegment: generateLineSegment2,
    setLineList,
  };
};
