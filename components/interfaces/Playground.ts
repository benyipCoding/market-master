import {
  CandlestickData,
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
  Time,
} from "lightweight-charts";
import { TChartRef } from "./TChart";
import { TechnicalIndicatorLine } from "./TechnicalIndexForm";
import { OrderSide, OrderType } from "./CandlestickSeries";

export interface AsideProps {
  className?: string;
  tChartRef: React.RefObject<TChartRef>;
  currentCandle: CandlestickData<Time> | undefined;
}

export interface AsideRef {
  container: HTMLDivElement | null;
}

export interface LeftAsideBtnsProps {
  className?: string;
  tChartRef: React.RefObject<TChartRef>;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTechnicalIndicatorLines: React.Dispatch<
    React.SetStateAction<TechnicalIndicatorLine[]>
  >;
  setBottomPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bottomPanelOpen: boolean;
}

export interface NavbarProps {
  className?: string;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dialogVisible: boolean;
  tChartRef: React.RefObject<TChartRef>;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
}

export interface RightAsideBtnsProps {
  className?: string;
  asideOpen: boolean;
  toggleAsideOpen: () => void;
}

export enum BottomPanelContent {
  Orders = "orders",
  Oscillators = "oscillators",
}

export enum OrderTabs {
  Opening = "opening",
  Limit = "limit",
  Closed = "closed",
}

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
  operationMode: OperationMode;
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
}

export enum AsideContent {
  Trade = "trade",
}
