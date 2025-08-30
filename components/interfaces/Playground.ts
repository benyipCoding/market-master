import {
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
} from "lightweight-charts";
import { TChartRef } from "./TChart";
import { TechnicalIndicatorLine } from "./TechnicalIndexForm";
import { OrderSide, OrderType } from "./CandlestickSeries";
import { CheckedState } from "@radix-ui/react-checkbox";

export interface AsideProps {
  className?: string;
  tChartRef: React.RefObject<TChartRef>;
}

export interface AsideRef {
  container: HTMLDivElement | null;
}

interface DialogController {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dialogVisible?: boolean;
}

export interface LeftAsideBtnsProps extends DialogController {
  className?: string;
  tChartRef: React.RefObject<TChartRef>;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  setTechnicalIndicatorLines: React.Dispatch<
    React.SetStateAction<TechnicalIndicatorLine[]>
  >;
  setBottomPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bottomPanelOpen: boolean;
}

export interface NavbarProps extends DialogController {
  className?: string;
  dialogVisible: boolean;
  tChartRef: React.RefObject<TChartRef>;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
}

export interface RightAsideBtnsProps {
  className?: string;
  asideOpen: boolean;
  setAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum BottomPanelContent {
  Orders = "orders",
  Oscillators = "oscillators",
  Hide = "hide",
}

export enum OrderTabs {
  Opening = "opening",
  Limit = "limit",
  Closed = "closed",
}

export const OrderNavs = [
  {
    label: "Open Orders",
    value: OrderTabs.Opening,
  },
  {
    label: "Limit Orders",
    value: OrderTabs.Limit,
  },
  {
    label: "Closed Orders",
    value: OrderTabs.Closed,
  },
];

export enum OrderStatus {
  PENDING = "pending",
  EXECUTED = "executed",
  CANCELLED = "cancelled",
  CLOSED = "closed",
}

export enum OperationMode {
  PRACTISE = "Practise",
  BLINDBOX = "Blindbox",
}

export interface ListOrderDto {
  orderStatus: OrderStatus;
  // operationMode: OperationMode;
  backtest_id: string;
}

export interface Order {
  closing_price?: number;
  comment?: string;
  create_at?: Date;
  executed_time?: Date;
  expiry_time?: Date;
  id: string;
  limit_price?: number;
  opening_price: number;
  order_type: OrderType;
  quantity: string;
  side: OrderSide;
  status: OrderStatus;
  stop_price?: number;
  symbol_id: number;
  time: string;
  update_at: Date;
  user_id: string;
  profit?: number;
  opening_price_line_id?: string;
  limit_price_line_id?: string;
  stop_price_line_id?: string;
}

export enum AsideContent {
  Trade = "trade",
}

export enum ClosePosAction {
  Actively = 0,
  StopLoss = 1,
  TakeProfit = 2,
}

export interface BottomPanelProps extends DialogController {}

export interface OrdersPanelProps extends DialogController {}

export interface UpdateOrderPayload {
  stopLossActive?: CheckedState;
  takeProfitActive?: CheckedState;
  stopLossValue?: number;
  takeProfitValue?: number;
}
