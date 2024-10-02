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
  TrendType,
} from "./interfaces";
import {
  calcCoordinate,
  makeLineData,
  recordEquationHandler,
} from "@/utils/helpers";
import { useContext, useEffect, useState } from "react";
import { EmitteryContext, OnSeriesCreate } from "@/providers/EmitteryProvider";

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
  const [iterator, setIterator] = useState<IterableIterator<{
    startPoint: AutomaticLinePoint;
    endPoint: AutomaticLinePoint;
  }> | null>(null);
  const [lineValue, setLineValue] = useState<{
    startPoint: AutomaticLinePoint;
    endPoint: AutomaticLinePoint;
  } | null>(null);

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
    const lineList: Array<{
      startPoint: AutomaticLinePoint;
      endPoint: AutomaticLinePoint;
    }> = [];

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

          newTrend === TrendType.Up && (low.index = index);
          newTrend === TrendType.Up && (low.price = currentLow);
          newTrend === TrendType.Up && (low.time = candle.time);

          newTrend === TrendType.Down && (high.index = index);
          newTrend === TrendType.Down && (high.price = currentHigh);
          newTrend === TrendType.Down && (high.time = candle.time);
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
          currentTrend = newTrend;
          // 结算前一个相反趋势线
          if (startPoint && endPoint) {
            lineList.push({ startPoint, endPoint });
          }

          startPoint = newTrend === TrendType.Up ? { ...low } : { ...high };
          endPoint = newTrend === TrendType.Up ? { ...high } : { ...low };
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

    setIterator(lineList[Symbol.iterator]());
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
    setAddtionalSeries(series);
  };

  useEffect(() => {
    if (!addtionalSeries) return;

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

    setCanNext(true);
  }, [addtionalSeries]);

  useEffect(() => {
    if (!canNext || !iterator || !tChartRef.current) return;
    setCanNext(() => false);

    const { done, value } = iterator.next();
    if (done) {
      setIterator(null);
      setCanNext(true);
      setAddtionalSeries(null);
      return;
    }
    setLineValue(value);

    const mainSeries = tChartRef.current.childSeries[0];
    const lineId = `${mainSeries.options().id}_line_${Date.now()}`;

    setDrawedLineList((prev) => [
      ...prev,
      {
        id: lineId,
        showLabel: false,
        customTitle: "",
        customType: CustomLineSeriesType.AutomaticDrawed,
      },
    ]);
  }, [canNext, iterator]);

  useEffect(() => {
    emittery?.on(OnSeriesCreate.LineSeries, lineSeriesCreatedHandler);

    return () => {
      emittery?.off(OnSeriesCreate.LineSeries, lineSeriesCreatedHandler);
    };
  }, []);

  return {
    performDrawing,
  };
};
