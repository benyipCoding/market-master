import {
  CandlestickData,
  ISeriesApi,
  Point,
  SeriesType,
  Time,
} from "lightweight-charts";
import { AutomaticLineDrawingArgs, CustomLineSeriesType } from "./interfaces";
import { calcCoordinate, makeLineData, recordEquation } from "@/utils/helpers";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { EmitteryContext, OnSeriesCreate } from "@/providers/EmitteryProvider";

export type AutomaticLinePoint = { index?: number; time: Time; price: number };

export enum TrendType {
  Up = 1,
  Down = -1,
}

export const useAutomaticLineDrawing = ({
  setDrawedLineList,
  tChartRef,
}: AutomaticLineDrawingArgs) => {
  const { emittery } = useContext(EmitteryContext);
  const [addtionalSeries, setAddtionalSeries] = useState<ISeriesApi<
    SeriesType,
    Time
  > | null>(null);

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
    const mainSeries = tChartRef.current.childSeries[0];
    const candlestickData = mainSeries.data() as CandlestickData<Time>[];

    // const lineId = `${mainSeries!.options().id}_line_${Date.now()}`;

    // setDrawedLineList((prev) => [
    //   ...prev,
    //   {
    //     id: lineId,
    //     showLabel: false,
    //     customTitle: "",
    //     customType: CustomLineSeriesType.AutomaticDrawed,
    //   },
    // ]);

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
      kCount: number = 5
    ) => {
      // 计算相隔多少根K线
      const diff =
        newTrend === TrendType.Up
          ? Math.abs(
              high.index! - (startPoint ? startPoint.index! : low.index!)
            ) + 1
          : Math.abs(
              (startPoint ? startPoint.index! : high.index!) - low.index!
            ) + 1;

      if (diff >= kCount) {
        if (currentTrend === newTrend) {
          // 趋势延续
          endPoint = newTrend === TrendType.Up ? { ...high } : { ...low };

          newTrend === TrendType.Up && (low.index = index);
          newTrend === TrendType.Up && (low.price = currentLow);

          newTrend === TrendType.Down && (high.index = index);
          newTrend === TrendType.Down && (high.price = currentHigh);
        } else {
          // 趋势改变或初始化
          currentTrend = newTrend;
          if (startPoint && endPoint) {
            lineList.push({ startPoint, endPoint });
          }

          startPoint = TrendType.Up ? { ...low } : { ...high };
          endPoint = TrendType.Up ? { ...high } : { ...low };
        }
      }
    };

    candlestickData.forEach((candle, index) => {
      if (index === 0) return;
      const currentHigh = Math.max(candle.open, candle.close);
      const currentLow = Math.min(candle.open, candle.close);

      if (currentHigh > high.price) {
        high.index = index;
        high.price = currentHigh;
        updateTrend(TrendType.Up, currentHigh, currentLow, index);
      }

      if (currentLow < low.price) {
        low.index = index;
        low.price = currentLow;
        updateTrend(TrendType.Down, currentHigh, currentLow, index);
      }
    });

    console.log(lineList);
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
    setAddtionalSeries(series);
  };

  useEffect(() => {
    if (!addtionalSeries) return;

    const candlestickData =
      tChartRef.current?.childSeries[0].data() as CandlestickData<Time>[];

    const lineData = generateLineData(
      {
        time: candlestickData[0].time as Time,
        price: candlestickData[0].open,
      },
      {
        time: candlestickData[9].time as Time,
        price: candlestickData[9].close,
      },
      addtionalSeries.options().id
    );

    addtionalSeries.setData(lineData);
    recordEquation(
      lineData[0].customValues! as unknown as Point,
      lineData[1].customValues! as unknown as Point,
      addtionalSeries.options().id,
      tChartRef.current!.setLineId_equation,
      tChartRef.current!.chart
    );
  }, [addtionalSeries]);

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
