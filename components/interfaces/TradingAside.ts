import { OrderSide } from "./CandlestickSeries";

export enum MiddleSection {
  Ticks = "ticks",
  Price = "price",
  USD = "usd",
  Percentage = "percentage",
}

export type LossAndProfitDataType = {
  [k in MiddleSection]: string | number;
} & {
  isModify?: boolean; // 用来判断用户是否手动调整过，如果用户主动调整则不会自动变化
  id?: string;
};

export interface LossAndProfitProps {
  currentSide: OrderSide;
  orderPrice: string | number | undefined;
  unitValue: number;
  canSubmitChange: (value: boolean) => void;
}
