"use client";
import { useSeries } from "@/hooks/useSeries";
import {
  AddPriceLinePayload,
  CandlestickSeriesProps,
  OrderSide,
  PriceLineType,
  UpdatePriceLinePayload,
} from "./interfaces/CandlestickSeries";
import { memo, useCallback, useContext, useEffect, useRef } from "react";
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
  IPriceLine,
} from "lightweight-charts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setAvgAmplitude, symbolToSeriesOptions } from "@/store/fetchDataSlice";
import { CreateOrderDto } from "@/app/playground/actions/createOrder";
import {
  orderPriceLineOptions,
  stopLossPriceLineOptions,
  takeProfitPriceLineOptions,
} from "@/constants/seriesOptions";
import { AsideContent } from "./interfaces/Playground";

const CandlestickSeries: React.FC<CandlestickSeriesProps> = ({
  seriesData,
}) => {
  const customOptions = useSelector((state: RootState) =>
    symbolToSeriesOptions(state)
  );
  const { series } = useSeries("Candlestick", seriesData, customOptions);
  const { emittery } = useContext(EmitteryContext);
  const dispatch = useDispatch<AppDispatch>();
  const priceLines = useRef<IPriceLine[]>([]);
  const { currentAside } = useSelector((state: RootState) => state.aside);

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

  const createPriceLine = useCallback(
    ({ price, id, type }: AddPriceLinePayload) => {
      if (!series) return;
      // @ts-ignore
      let priceLine: PriceLineOptions = {
        price,
        id,
      };

      switch (type) {
        case PriceLineType.StopLoss:
          priceLine = Object.assign({}, priceLine, stopLossPriceLineOptions);
          break;

        case PriceLineType.TakeProfit:
          priceLine = Object.assign({}, priceLine, takeProfitPriceLineOptions);
          break;

        case PriceLineType.OrderPrice:
          priceLine = Object.assign({}, priceLine, orderPriceLineOptions);
          break;
        default:
          break;
      }

      return series.createPriceLine(priceLine);
    },
    [series]
  );

  const addPriceLine = (payload: AddPriceLinePayload) => {
    const priceLine = createPriceLine(payload);
    priceLines.current.push(priceLine!);
    console.log(priceLine?.options().id);
  };

  const removePriceLine = (id: string | undefined) => {
    if (!id) return;
    const target = priceLines.current.find((p) => p.options().id === id);
    if (!target) return;
    series?.removePriceLine(target);
  };

  const updatePriceLine = ({ id, options }: UpdatePriceLinePayload) => {
    const target = priceLines.current.find((p) => p.options().id === id);
    if (!target) return;
    target.applyOptions(options);
  };

  const removePreOrderPriceLine = useCallback(() => {
    const target = priceLines.current.find((p) =>
      p.options().id?.includes(PriceLineType.OrderPrice)
    );
    if (!target) return;
    series?.removePriceLine(target);
    priceLines.current = priceLines.current.filter(
      (p) => p.options().id !== target.options().id
    );
  }, [series]);

  useEffect(() => {
    emittery?.on(OnApply.ResetMainSeriesData, resetDataHandler);
    emittery?.on(OnOrderMarker.add, addOrderMarker);
    emittery?.on(OnOrderMarker.removeAll, removeOrderMarkers);
    emittery?.on(OnPriceLine.add, addPriceLine);
    emittery?.on(OnPriceLine.remove, removePriceLine);
    emittery?.on(OnPriceLine.update, updatePriceLine);

    return () => {
      emittery?.off(OnApply.ResetMainSeriesData, resetDataHandler);
      emittery?.off(OnOrderMarker.add, addOrderMarker);
      emittery?.off(OnOrderMarker.removeAll, removeOrderMarkers);
      emittery?.off(OnPriceLine.add, addPriceLine);
      emittery?.off(OnPriceLine.remove, removePriceLine);
      emittery?.off(OnPriceLine.update, updatePriceLine);
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
    return () => {
      if (currentAside === AsideContent.Trade) {
        removePreOrderPriceLine();
      }
    };
  }, [currentAside, removePreOrderPriceLine]);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
