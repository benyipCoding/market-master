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
  DifferDrawType,
  LineState,
  TrendType,
} from "./interfaces";
import {
  calcCoordinate,
  makeLineData,
  recordEquationHandler,
  removeSeries,
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

  const performDrawing = (data?: CandlestickData<Time>[]) => {
    if (!tChartRef.current) return;
    const candlestickData =
      data ||
      (tChartRef.current.childSeries[0].data() as CandlestickData<Time>[]);

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

    candlestickData.forEach((candle, index, arr) => {
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

      if (index === arr.length - 1 && startPoint && endPoint) {
        lines.push({
          startPoint,
          endPoint,
          trend: currentTrend!,
          type: CustomLineSeriesType.AutomaticDrawed,
        });
      }
    });

    return lines;
  };

  const canDrawSegment = (
    rootPen: LineState,
    rootIndex: number,
    pens: LineState[]
  ) => {
    let reference: LineState = rootPen;
    let endIndex: number | undefined = undefined;
    let isFirstTime = true;

    for (let i = rootIndex + 2; i < pens.length; i += 2) {
      const currentTrend = reference.trend;
      const currentStartPrice = reference.startPoint.price;
      const currentEndPrice = reference.endPoint.price;
      const prevPen = pens[rootIndex - 1];

      const nextSameTrendLine = pens[i];
      const nextStartPrice = nextSameTrendLine.startPoint.price;
      const nextEndPrice = nextSameTrendLine.endPoint.price;

      // 1. 趋势不可能持续的情况

      const canNotGrow =
        rootPen.trend === TrendType.Up
          ? nextStartPrice < rootPen.startPoint.price
          : nextStartPrice > rootPen.startPoint.price;

      if (canNotGrow) {
        return endIndex;
      }

      if (endIndex) {
        const nextReversePen = pens[i - 1];
        const reverseEndIndex = canDrawSegment(nextReversePen, i - 1, pens);
        if (reverseEndIndex) {
          return endIndex;
        }
      }
      if (i - rootIndex < 4) continue;

      // 2. 可持续情况一
      const canGrow1 =
        currentTrend === TrendType.Up
          ? (nextStartPrice > currentStartPrice ||
              nextStartPrice > rootPen.startPoint.price) &&
            nextEndPrice > currentEndPrice
          : (nextStartPrice < currentStartPrice ||
              nextStartPrice < rootPen.startPoint.price) &&
            nextEndPrice < currentEndPrice;
      if (canGrow1) {
        endIndex = i;
        reference = pens[i];
        isFirstTime = false;
        continue;
      }

      // 3. 可持续情况二
      if (!prevPen || !isFirstTime) continue;
      const prevStartPrice = prevPen.startPoint.price;
      const canGrow2 =
        currentTrend === TrendType.Up
          ? currentEndPrice > prevStartPrice && nextEndPrice > prevStartPrice
          : currentEndPrice < prevStartPrice && nextEndPrice < prevStartPrice;
      if (canGrow2) {
        endIndex = i;
        reference = pens[i];
        isFirstTime = false;
        continue;
      }
    }

    return endIndex;
  };

  const fixGap = (segmentList: LineState[]): LineState[] => {
    const newSegmentList: LineState[] = [];

    for (let i = 0; i < segmentList.length; i++) {
      const currentSegment = segmentList[i];

      if (!newSegmentList.length) {
        newSegmentList.push({ ...currentSegment });
        continue;
      }

      const prevSegment = newSegmentList[newSegmentList.length - 1];

      const noGap =
        prevSegment.endPoint.price === currentSegment.startPoint.price &&
        prevSegment.endPoint.time === currentSegment.startPoint.time;

      if (noGap) {
        newSegmentList.push({ ...currentSegment });
        continue;
      }

      // 当前线段跟上一条线段同向
      if (currentSegment.trend === prevSegment.trend) {
        // 右包含
        const rightContains =
          currentSegment.trend === TrendType.Up
            ? currentSegment.startPoint.price < prevSegment.startPoint.price &&
              currentSegment.endPoint.price > prevSegment.endPoint.price
            : currentSegment.startPoint.price > prevSegment.startPoint.price &&
              currentSegment.endPoint.price < prevSegment.endPoint.price;
        // 左包含
        const leftContains =
          currentSegment.trend === TrendType.Up
            ? prevSegment.startPoint.price < currentSegment.startPoint.price &&
              prevSegment.endPoint.price > currentSegment.endPoint.price
            : prevSegment.startPoint.price > currentSegment.startPoint.price &&
              prevSegment.endPoint.price < currentSegment.endPoint.price;

        if (rightContains) {
          const prevprevSegment = newSegmentList[newSegmentList.length - 2];
          prevprevSegment.endPoint.price = currentSegment.startPoint.price;
          prevprevSegment.endPoint.time = currentSegment.startPoint.time;
          newSegmentList.pop();
          newSegmentList.push({ ...currentSegment });
          continue;
        }

        if (leftContains) {
          continue;
        }

        // 既不是左包含，也不是右包含
        const sortedStartPoint = [
          currentSegment.startPoint,
          prevSegment.startPoint,
        ].sort((a, b) => a.price - b.price);
        const sortedEndPoint = [
          currentSegment.endPoint,
          prevSegment.endPoint,
        ].sort((a, b) => a.price - b.price);

        const commonStartPoint =
          currentSegment.trend === TrendType.Up
            ? sortedStartPoint[0]
            : sortedStartPoint[1];
        const commonEndPoint =
          currentSegment.trend === TrendType.Up
            ? sortedEndPoint[1]
            : sortedEndPoint[0];
        newSegmentList.pop();
        newSegmentList.push({
          ...currentSegment,
          startPoint: {
            ...currentSegment.startPoint,
            price: commonStartPoint.price,
            time: commonStartPoint.time,
          },
          endPoint: {
            ...currentSegment.endPoint,
            price: commonEndPoint.price,
            time: commonEndPoint.time,
          },
        });
        continue;
      }
      // 当前线段跟上一条线段反向
      else {
        const sorted = [prevSegment.endPoint, currentSegment.startPoint].sort(
          (a, b) => a.price - b.price
        );

        const connectPoint =
          currentSegment.trend === TrendType.Up ? sorted[0] : sorted[1];

        prevSegment.endPoint.price = connectPoint.price;
        prevSegment.endPoint.time = connectPoint.time;

        newSegmentList.push({
          ...currentSegment,
          startPoint: {
            ...currentSegment.startPoint,
            price: connectPoint.price,
            time: connectPoint.time,
          },
        });
        continue;
      }
    }

    return newSegmentList;
  };

  const generateLineSegment = (
    pens: LineState[],
    type: CustomLineSeriesType = CustomLineSeriesType.SegmentDrawed
  ): LineState[] => {
    const segmentList: LineState[] = [];

    for (let i = 0; i < pens.length; i++) {
      const rootPen = pens[i];
      const endIndex = canDrawSegment(rootPen, i, pens);

      if (!endIndex) continue;
      segmentList.push({
        startPoint: rootPen.startPoint,
        endPoint: pens[endIndex].endPoint,
        trend: rootPen.trend,
        type,
      });

      i = endIndex;
    }

    return fixGap(segmentList);
  };

  const drawSegment = () => {
    if (autoDrawing) return;
    const segmentList = generateLineSegment(performDrawing()!);
    setLineList(segmentList);
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
    setAddtionalSeries(series);
  };

  const drawLineInVisibleRange = () => {
    if (autoDrawing) return;
    const { chart, childSeries } = tChartRef.current!;

    // 再画新的
    const timeScale = chart.timeScale();
    const mainData = childSeries[0].data();
    const { to, from } = timeScale?.getVisibleRange()!;
    const sliceData = mainData?.filter(
      (data) => data.time >= from && data.time <= to
    );

    const lines = performDrawing(sliceData as CandlestickData<Time>[]);
    setLineList(lines!);
  };

  const deleteAutomaticLines = (type: CustomLineSeriesType) => {
    const { chart, childSeries, setChildSeries, setLineId_equation } =
      tChartRef.current!;
    const penSeries = childSeries.filter(
      (series) => series.options().customType === type
    );
    penSeries.forEach((series) => {
      removeSeries({
        chart,
        selectedSeries: series,
        setChildSeries,
        setDrawedLineList,
        setLineId_equation,
      });
    });
  };

  const deleteSeries = (series: ISeriesApi<SeriesType, Time>) => {
    const { chart, setChildSeries, setLineId_equation } = tChartRef.current!;
    removeSeries({
      chart,
      selectedSeries: series,
      setChildSeries,
      setDrawedLineList,
      setLineId_equation,
    });
  };

  const getLastPens = () => {
    const { childSeries } = tChartRef.current!;
    // 已画笔
    const penSeriesList = childSeries.filter(
      (series) =>
        series.options().customType === CustomLineSeriesType.AutomaticDrawed
    );
    // 数据笔
    const dataPens = performDrawing()!;

    // 对比最后一根的起始点位时间
    const lastDataPen = dataPens[dataPens.length - 1];
    const lastDrawedPenSeries = penSeriesList[penSeriesList.length - 1];

    const segmentSeriesList = childSeries.filter(
      (series) =>
        series.options().customType === CustomLineSeriesType.SegmentDrawed
    );

    const dataSegment = generateLineSegment(dataPens);
    const lastDataSegment: LineState = dataSegment[dataSegment.length - 1];
    const lastDrawedSegmentSeries =
      segmentSeriesList[segmentSeriesList.length - 1];

    return {
      lastDataPen,
      lastDrawedPenSeries,
      lastDataSegment,
      lastDrawedSegmentSeries,
    };
  };

  const differDraw = (
    type: DifferDrawType,
    lastDataPen: LineState,
    lastDrawedPenSeries: ISeriesApi<SeriesType, Time>
  ) => {
    const lastDataPenStartTime = lastDataPen.startPoint.time;
    const lastDataPenEndTime = lastDataPen.endPoint.time;
    const lastDrawedPenStartTime = lastDrawedPenSeries.data()[0].time;
    const lastDrawedPenEndTime = lastDrawedPenSeries.data()[1].time;

    if (
      lastDataPenStartTime !== lastDrawedPenStartTime &&
      type === DifferDrawType.Incremental
    ) {
      setLineList([lastDataPen]);
      return;
    }

    if (
      lastDataPenStartTime !== lastDrawedPenStartTime &&
      type === DifferDrawType.Decremental
    ) {
      lastDataPenStartTime < lastDrawedPenStartTime &&
        deleteSeries(lastDrawedPenSeries);
      return;
    }

    if (lastDataPenEndTime === lastDrawedPenEndTime) return;

    deleteSeries(lastDrawedPenSeries);
    setLineList([lastDataPen]);
    return;
  };

  // 增量画笔
  const differDrawAction = (type: DifferDrawType) => {
    const {
      lastDataPen,
      lastDrawedPenSeries,
      lastDataSegment,
      lastDrawedSegmentSeries,
    } = getLastPens();
    if (lastDrawedPenSeries) {
      differDraw(type, lastDataPen, lastDrawedPenSeries);
    }

    if (lastDrawedSegmentSeries) {
      Promise.resolve().then(() => {
        differDraw(type, lastDataSegment, lastDrawedSegmentSeries);
      });
    }
  };

  useEffect(() => {
    if (!addtionalSeries) return;

    try {
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

      // 当前可视范围
      const { from, to } = tChartRef
        .current!.chart.timeScale()
        .getVisibleRange()!;
      // 当前线段起始点时间
      if (value.startPoint.time < from || value.startPoint.time > to) {
        const timeScale = tChartRef.current.chart.timeScale();
        const coordinate = timeScale.timeToCoordinate(value.startPoint.time)!;
        const logical = timeScale.coordinateToLogical(coordinate)!;
        const mainSeries = tChartRef.current.childSeries[0];
        const maxLogical = mainSeries.data().length;
        const regularTo = logical + 2000;

        timeScale.setVisibleLogicalRange({
          from: logical,
          to: Math.min(regularTo, maxLogical),
        });
      }

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
  }, [emittery]);

  return {
    drawSegment,
    autoDrawing,
    generateLineSegment,
    setLineList,
    drawLineInVisibleRange,
    deleteAutomaticLines,
    differDrawAction,
  };
};
