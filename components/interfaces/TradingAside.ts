import { OrderSide, OrderType } from "./CandlestickSeries";

export enum MiddleSection {
  Ticks = "ticks",
  Price = "price",
  USD = "usd",
  Percentage = "percentage",
}

export type LossAndProfitDataType = {
  [k in MiddleSection]: string | number;
};

export interface LossAndProfitProps {
  currentSide: OrderSide;
  currentOrderType: OrderType;
  preOrderPrice: string | undefined;
}
