import {
  CandlestickData,
  Time,
  CandlestickSeriesPartialOptions,
} from "lightweight-charts";

export interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
}

export enum OrderSide {
  buy = "buy",
  sell = "sell",
}

export type OrderMarkerPayload = {
  side: OrderSide;
  price: number;
  time: Time;
};
