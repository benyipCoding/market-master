import {
  CandlestickData,
  ISeriesApi,
  LineData,
  Point,
  SeriesType,
  Time,
} from "lightweight-charts";
import { AutomaticLineDrawingArgs, CustomLineSeriesType } from "./interfaces";
import { calcCoordinate, makeLineData, recordEquation } from "@/utils/helpers";
import { useContext, useEffect, useState } from "react";
import { EmitteryContext, OnSeriesCreate } from "@/providers/EmitteryProvider";

export const useAutomaticLineDrawing = ({
  setDrawedLineList,
  tChartRef,
}: // childSeries,
// chart,
AutomaticLineDrawingArgs) => {
  // let highPoint = { price: 0, index: 0 };
  // let lowPoint = { price: 999999, index: 999999 };
  const [lineData, setLineData] = useState<LineData<Time>[]>();
  const { emittery } = useContext(EmitteryContext);
  const [series, setSeries] = useState<ISeriesApi<SeriesType, Time>>();

  const generateLinePoint = (
    time: Time,
    price: number,
    mainSeries: ISeriesApi<SeriesType, Time>
  ) => {
    const { x, y, logic } = calcCoordinate({
      time,
      price,
      series: mainSeries!,
      chart: tChartRef.current?.chart!,
    });

    return {
      value: price,
      time,
      customValues: { x, y, logic, price },
    };
  };

  const performDrawing = () => {
    if (!tChartRef.current) return;
    const childSeries = tChartRef.current.childSeries;

    const mainSeries = childSeries[0];

    // 1. 增加一个LineSeries组件到TChart里
    const lineId = `${mainSeries!.options().id}_line_${Date.now()}`;
    setDrawedLineList((prev) => [
      ...prev,
      {
        id: lineId,
        showLabel: false,
        customTitle: "",
        customType: CustomLineSeriesType.AutomaticDrawed,
      },
    ]);
    // 2. 给这个LineSeries组件setData
    const candlestickData = mainSeries.data() as CandlestickData<Time>[];

    // 起始点
    const startPoint = generateLinePoint(
      candlestickData[3].time,
      candlestickData[3].open,
      mainSeries
    );
    // 结束点
    const endPoint = generateLinePoint(
      candlestickData[16].time,
      candlestickData[16].close,
      mainSeries
    );
    setLineData(makeLineData(startPoint, endPoint, lineId));
  };

  const lineSeriesCreatedHandler = (series: ISeriesApi<SeriesType, Time>) => {
    setSeries(series);
  };

  useEffect(() => {
    if (!series || !lineData || !tChartRef.current) return;

    series.setData(lineData);
    recordEquation(
      lineData[0].customValues! as unknown as Point,
      lineData[1].customValues! as unknown as Point,
      series.options().id,
      tChartRef.current?.setLineId_equation,
      tChartRef.current.chart
    );
  }, [series, lineData]);

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
