"use client";
import { useSeries } from "@/hooks/useSeries";
import {
  AddPriceLinePayload,
  CandlestickSeriesProps,
  OrderSide,
} from "./interfaces/CandlestickSeries";
import { memo, useCallback, useContext, useEffect } from "react";
import {
  EmitteryContext,
  OnApply,
  OnOrderMarker,
  OnPriceLine,
} from "@/providers/EmitteryProvider";
import {
  SeriesPartialOptions,
  CandlestickStyleOptions,
  CandlestickData,
  Time,
  SeriesMarker,
  PriceLineOptions,
  LineWidth,
  LineStyle,
} from "lightweight-charts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setAvgAmplitude, symbolToSeriesOptions } from "@/store/fetchDataSlice";
import { CreateOrderDto } from "@/app/playground/actions/createOrder";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const customOptions = useSelector((state: RootState) =>
    symbolToSeriesOptions(state)
  );
  const { series } = useSeries("Candlestick", seriesData, customOptions);
  const { emittery } = useContext(EmitteryContext);
  const dispatch = useDispatch<AppDispatch>();

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

  const addOrderMarker = useCallback(
    ({ side, opening_price, time }: CreateOrderDto) => {
      const prevMarkers = series?.markers();
      const marker: SeriesMarker<Time> = {
        time: time as Time,
        position: side === OrderSide.BUY ? "belowBar" : "aboveBar",
        color: "#3b82f6",
        shape: side === OrderSide.BUY ? "arrowUp" : "arrowDown",
        text: `${opening_price}`,
        size: 2,
      };
      const markers = prevMarkers ? [...prevMarkers, marker] : [marker];
      series?.setMarkers(markers);
    },
    [series]
  );

  const removeOrderMarkers = useCallback(() => {
    series?.setMarkers([]);
  }, [series]);

  const addPriceLineAction = useCallback(
    (price: number) => {
      if (!series) return;
      // @ts-ignore
      const priceLine: PriceLineOptions = {
        price,
        lineStyle: LineStyle.Dotted,
        color: "#3179F5",
        lineWidth: 1 as LineWidth,
        axisLabelVisible: true,
        title: "test",
        lineVisible: true,
      };

      return series.createPriceLine(priceLine);
    },
    [series]
  );

  const addPriceLine = ({ type, action, price }: AddPriceLinePayload) => {
    const priceLine = addPriceLineAction(price);
    console.log(priceLine?.options());
    setTimeout(() => {
      series?.removePriceLine(priceLine!);
    }, 2000);
  };

  useEffect(() => {
    emittery?.on(OnApply.ResetMainSeriesData, resetDataHandler);
    emittery?.on(OnOrderMarker.add, addOrderMarker);
    emittery?.on(OnOrderMarker.removeAll, removeOrderMarkers);
    emittery?.on(OnPriceLine.add, addPriceLine);

    return () => {
      emittery?.off(OnApply.ResetMainSeriesData, resetDataHandler);
      emittery?.off(OnOrderMarker.add, addOrderMarker);
      emittery?.off(OnOrderMarker.removeAll, removeOrderMarkers);
      emittery?.off(OnPriceLine.add, addPriceLine);
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

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
