"use client";
import { useSeries } from "@/hooks/useSeries";
import {
  CandlestickSeriesProps,
  OrderMarkerPayload,
  OrderSide,
} from "./interfaces/CandlestickSeries";
import { memo, useContext, useEffect, useMemo, useRef } from "react";
import {
  EmitteryContext,
  OnApply,
  OnOrderMarker,
} from "@/providers/EmitteryProvider";
import {
  SeriesPartialOptions,
  CandlestickStyleOptions,
  CandlestickData,
  Time,
  createSeriesMarkers,
  ISeriesMarkersPluginApi,
  SeriesMarker,
} from "lightweight-charts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setAvgAmplitude, symbolToSeriesOptions } from "@/store/fetchDataSlice";
import { defaultCandleStickOptions } from "@/constants/seriesOptions";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const customOptions = useSelector((state: RootState) =>
    symbolToSeriesOptions(state)
  );
  const { series } = useSeries("Candlestick", seriesData, customOptions);
  const { emittery } = useContext(EmitteryContext);
  const dispatch = useDispatch<AppDispatch>();
  const seriesMarkerPlugin = useRef<ISeriesMarkersPluginApi<Time>>();

  const resetDataHandler = ({
    customOptions,
    seriesData,
  }: {
    customOptions: SeriesPartialOptions<CandlestickStyleOptions>;
    seriesData: CandlestickData<Time>[];
  }) => {
    series?.applyOptions(customOptions);
    series?.setData(seriesData);
  };

  const addOrderMarker = ({ side, price, time }: OrderMarkerPayload) => {
    const prevMarkers = seriesMarkerPlugin.current?.markers();
    const marker: SeriesMarker<Time> = {
      time,
      position: side === OrderSide.buy ? "belowBar" : "aboveBar",
      color: "#1cd66c",
      shape: side === OrderSide.buy ? "arrowUp" : "arrowDown",
      text: `${price}`,
      size: 2,
    };
    const markers = prevMarkers ? [...prevMarkers, marker] : [marker];
    seriesMarkerPlugin.current?.setMarkers(markers);
  };

  const removeOrderMarkers = () => {
    seriesMarkerPlugin.current?.setMarkers([]);
  };

  useEffect(() => {
    emittery?.on(OnApply.ResetMainSeriesData, resetDataHandler);
    emittery?.on(OnOrderMarker.add, addOrderMarker);

    return () => {
      emittery?.off(OnApply.ResetMainSeriesData, resetDataHandler);
      emittery?.off(OnOrderMarker.add, addOrderMarker);
    };
  }, [series, emittery]);

  useEffect(() => {
    series?.applyOptions(customOptions);
  }, [customOptions]);

  useEffect(() => {
    if (!seriesData.length) {
      series?.setData([]);
      return;
    }

    // 求平均振幅
    const totalAmplitude = seriesData.reduce(
      (res, cur) => res + (cur.high - cur.low),
      0
    );
    const avgAmplitude = totalAmplitude / seriesData.length;
    dispatch(setAvgAmplitude(avgAmplitude));
  }, [seriesData]);

  useEffect(() => {
    if (!series) return;
    seriesMarkerPlugin.current = createSeriesMarkers(series);

    return () => {
      seriesMarkerPlugin.current?.detach();
    };
  }, [series]);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
