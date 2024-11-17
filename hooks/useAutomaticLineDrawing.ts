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

  // const [iterator, setIterator] = useState<IterableIterator<LineState> | null>(
  //   null
  // );
  // const [segmentIterator, setSegmentIterator] =
  //   useState<IterableIterator<LineState> | null>(null);
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

  const performDrawing = () => {
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

    setLineList(lines);

    // setIterator(lineList[Symbol.iterator]());

    // 从笔到线段的整合
    // const segmentList = generateLineSegment(lineList);
    // const segmentList = generateLineSegment2(lineList);

    // setIterator(segmentList[Symbol.iterator]());

    // setSegmentIterator(segmentList[Symbol.iterator]());
  };

  const drawSegment = () => {
    const index = prompt("请输入笔的索引");
    const segmentList = generateLineSegment2(lineList, +index!);
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
        console.log("突破根笔的起点而终止");
        console.log("突破的index", i);

        return endIndex;
      }

      if (endIndex) {
        const nextReverseLine = lineList[i - 1];
        const res = canDrawSegment2(nextReverseLine, i - 1, lineList);
        if (res) {
          console.log("反向笔能画出线段而终止");
          console.log("反向比的索引", i - 1);

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
    index?: number
  ): LineState[] => {
    let segmentTrend: TrendType | null = null;
    let segmentStart: AutomaticLinePoint | null = null;
    let segmentEnd: AutomaticLinePoint | null = null;

    const endIndex = canDrawSegment2(lineList[index!], index!, lineList);
    console.log(endIndex);

    return [];
  };

  // 辅助函数，当前笔的方向在未来是否有可能成为线段
  const canDrawSegment = (
    line: LineState,
    index: number,
    arr: LineState[],
    segmentTrend: TrendType | null,
    segmentStartIndex: number,
    segmentEndIndex: number
  ): [boolean, number] => {
    const currentTrend = line.trend;
    const currentStartPrice = line.startPoint.price;
    const currentEndPrice = line.endPoint.price;
    const prevLine = arr[index - 1];

    for (let i = index + 2; i < arr.length; i += 2) {
      const nextSameTrendLine = arr[i];
      const nextStartPrice = nextSameTrendLine.startPoint.price;
      const nextEndPrice = nextSameTrendLine.endPoint.price;

      // 1. 趋势不可能持续的情况
      const canNotGrow =
        currentTrend === TrendType.Up
          ? nextStartPrice < currentStartPrice && nextEndPrice < currentEndPrice
          : nextStartPrice > currentStartPrice &&
            nextEndPrice > currentEndPrice;
      const canNotGrow2 =
        segmentTrend === TrendType.Up
          ? currentTrend !== segmentTrend && nextStartPrice > currentStartPrice
          : currentTrend !== segmentTrend && nextStartPrice < currentStartPrice;
      const canNotGrow3 = index - segmentStartIndex === 1 && segmentTrend;
      const canNotGrow4 = index < segmentEndIndex;

      if (canNotGrow || canNotGrow2 || canNotGrow3 || canNotGrow4)
        return [false, -1];

      // 2. 可持续情况一
      const canGrow1 =
        currentTrend === TrendType.Up
          ? nextStartPrice > currentStartPrice && nextEndPrice > currentEndPrice
          : nextStartPrice < currentStartPrice &&
            nextEndPrice < currentEndPrice;
      if (canGrow1) return [true, i];

      // 3. 可持续情况二
      if (!prevLine || segmentTrend === line.trend) continue;
      const prevStartPrice = prevLine.startPoint.price;
      const canGrow2 =
        currentTrend === TrendType.Up
          ? currentEndPrice > prevStartPrice && nextEndPrice > prevStartPrice
          : currentEndPrice < prevStartPrice && nextEndPrice < prevStartPrice;
      if (canGrow2) return [true, i];
    }
    return [false, -1];
  };

  const generateLineSegment = (lineList: LineState[]): LineState[] => {
    let segmentTrend: TrendType | null = null;
    let segmentStart: AutomaticLinePoint | null = null;
    let segmentStartIndex: number = 0;
    let segmentEndIndex: number = 0;
    const segmentList: LineState[] = [];

    lineList.forEach((line, index, arr) => {
      const [canDraw, endIndex] = canDrawSegment(
        line,
        index,
        arr,
        segmentTrend,
        segmentStartIndex,
        segmentEndIndex
      );

      if (canDraw && !segmentTrend) {
        segmentStart = line.startPoint;
        segmentStartIndex = index;
        segmentTrend = line.trend;
        return;
      }

      if (canDraw && segmentTrend !== line.trend) {
        segmentList.push({
          startPoint: segmentStart!,
          endPoint: line.startPoint,
          trend: segmentTrend!,
          type: CustomLineSeriesType.SegmentDrawed,
        });
        segmentStart = line.startPoint;
        segmentStartIndex = index;
        segmentTrend = line.trend;
        segmentEndIndex = endIndex;
        return;
      }
    });

    return segmentList;
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
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
      console.log("这里是监听addtionalSeries的useEffect");
    }
  }, [addtionalSeries]);

  useEffect(() => {
    if (!canNext || !iterator || !tChartRef.current) return;

    setCanNext(() => false);
    setAutoDrawing(true);
    try {
      const { done, value } = iterator.next();
      if (done) {
        setCanNext(true);
        setAddtionalSeries(null);
        setAutoDrawing(false);
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
            : SeriesColors.find((color) => color.label === "yellow")?.value,
      };

      setDrawedLineList((prev) => [...prev, lineOption]);
    } catch (error) {
      console.log("这里是监听canNext和iterator的useEffect");
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
  };
};
