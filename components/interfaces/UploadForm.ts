import { CandlestickData, Time } from "lightweight-charts";

export interface UploadFormValue extends Record<string, any> {
  symbol: string;
  interval: string;
  // customInterval: string;
  toFixedNum: number;
  file: File | null;
  data: CandlestickData<Time>[];
  hasVol: boolean;
  total: number;
}

export interface PayloadForCreateKlines {
  data: {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    timestamp: number;
  }[];
  symbol: string;
  period: string;
  precision: number;
}
