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

export enum PriceLineType {
  StopLoss = "priceLine_stopLoss",
  TakeProfit = "priceLine_takeProfit",
}

export interface AddPriceLinePayload {
  type: PriceLineType;
  price: number;
  action: "add" | "remove";
}
