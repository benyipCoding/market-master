import { CandlestickData, Time } from "lightweight-charts";

export interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
}

export enum OrderSide {
  BUY = "buy",
  SELL = "sell",
}

export enum OrderType {
  MARKET = "market",
  LIMIT = "limit",
}
