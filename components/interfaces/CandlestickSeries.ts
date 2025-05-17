import { CandlestickData, PriceLineOptions, Time } from "lightweight-charts";

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
  OpeningPrice = "priceLine_openingPrice",
  OrderPrice = "priceLine_orderPrice",
  LimitOrderPrice = "priceLine_limit_orderPrice",
  OpenOrderStopLoss = "priceLine_openingPrice_stopLoss",
  OpenOrderTakeProfit = "priceLine_openingPrice_takeProfit",
}

export interface AddPriceLinePayload {
  price: number;
  id: string;
  type: PriceLineType;
}

export interface UpdatePriceLinePayload {
  id: string;
  options: Partial<PriceLineOptions>;
}

export enum MarkerColor {
  profit = "#19964e",
  loss = "#e33c2f",
}
