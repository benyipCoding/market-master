"use client";
import { useSeries } from "@/hooks/useSeries";
import {
  AddPriceLinePayload,
  CandlestickSeriesProps,
  MarkerColor,
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
  limitOrderPriceLineOptions,
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
  const { isBackTestMode, currentCandle } = useSelector(
    (state: RootState) => state.fetchData
  );

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

  const generateMarkerId = (
    side: OrderSide,
    opening_price: number,
    time: number | Time
  ): string => {
    return `${side}_${opening_price}_${time}_${Date.now()}`;
  };

  const parseMarkerId = (id: string) => {
    const [side, opening_price, time, timestamp] = id.split("_");
    return {
      side,
      opening_price: Number(opening_price),
      time: Number(time),
      timestamp: Number(timestamp),
    };
  };

  const addOrderMarker = useCallback(
    ({ side, opening_price, time }: CreateOrderDto) => {
      const prevMarkers = series?.markers();

      const samePosition = prevMarkers?.find((m) => {
        const payload = parseMarkerId(m.id!);
        return payload.side === side && payload.time === time;
      });

      if (samePosition) {
        return;
      }

      const marker: SeriesMarker<Time> = {
        id: generateMarkerId(side, opening_price, time),
        time: time as Time,
        position: side === OrderSide.BUY ? "belowBar" : "aboveBar",
        color: MarkerColor.profit,
        shape: side === OrderSide.BUY ? "arrowUp" : "arrowDown",
        text: `${opening_price}`,
        size: 2,
      };
      const markers = prevMarkers ? [...prevMarkers, marker] : [marker];
      series?.setMarkers(markers);
    },
    [series]
  );

  // const updateOrderMarker = useCallback(
  //   (id: string, options: SeriesMarker<Time>) => {
  //     const targetMarker = series?.markers().find((m) => m.id === id);
  //     if (!targetMarker) return;
  //     console.log({ targetMarker });
  //   },
  //   [series]
  // );

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

        case PriceLineType.LimitOrderPrice:
          priceLine = Object.assign({}, priceLine, limitOrderPriceLineOptions);
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
      p.options().id?.includes(PriceLineType.LimitOrderPrice)
    );
    if (!target) return;
    series?.removePriceLine(target);
    priceLines.current = priceLines.current.filter(
      (p) => p.options().id !== target.options().id
    );
  }, [series]);

  // const clearPriceLine = useCallback(() => {
  //   priceLines.current.forEach((p) => {
  //     series?.removePriceLine(p);
  //   });
  // }, [series]);

  useEffect(() => {
    emittery?.on(OnApply.ResetMainSeriesData, resetDataHandler);
    emittery?.on(OnOrderMarker.add, addOrderMarker);
    emittery?.on(OnOrderMarker.removeAll, removeOrderMarkers);
    emittery?.on(OnPriceLine.add, addPriceLine);
    emittery?.on(OnPriceLine.remove, removePriceLine);
    emittery?.on(OnPriceLine.update, updatePriceLine);
    // emittery?.on(OnPriceLine.clear, clearPriceLine);

    return () => {
      emittery?.off(OnApply.ResetMainSeriesData, resetDataHandler);
      emittery?.off(OnOrderMarker.add, addOrderMarker);
      emittery?.off(OnOrderMarker.removeAll, removeOrderMarkers);
      emittery?.off(OnPriceLine.add, addPriceLine);
      emittery?.off(OnPriceLine.remove, removePriceLine);
      emittery?.off(OnPriceLine.update, updatePriceLine);
      // emittery?.off(OnPriceLine.clear, clearPriceLine);
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
      isBackTestMode && removePreOrderPriceLine();
    };
  }, [isBackTestMode, removePreOrderPriceLine]);

  useEffect(() => {
    return () => {
      if (currentAside === AsideContent.Trade) {
        removePreOrderPriceLine();
      }
    };
  }, [currentAside, removePreOrderPriceLine]);

  useEffect(() => {
    if (!series) return;
    const markers = series.markers();
    if (!markers.length) return;

    markers.forEach((m) => {
      const side = m.id!.split("_")[0];
      if (side === OrderSide.BUY) {
        currentCandle!.close >= Number(m.text) &&
          (m.color = MarkerColor.profit);
        currentCandle!.close < Number(m.text) && (m.color = MarkerColor.loss);
      } else if (side === OrderSide.SELL) {
        currentCandle!.close <= Number(m.text) &&
          (m.color = MarkerColor.profit);
        currentCandle!.close > Number(m.text) && (m.color = MarkerColor.loss);
      }
    });

    series.setMarkers(markers);
  }, [currentCandle, series]);

  return null;
};

const CandlestickSeriesWithMemo = memo(CandlestickSeries);

export default CandlestickSeriesWithMemo;
