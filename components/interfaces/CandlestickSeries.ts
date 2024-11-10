import {
  CandlestickData,
  Time,
  CandlestickSeriesPartialOptions,
} from "lightweight-charts";

export interface CandlestickSeriesProps {
  seriesData: CandlestickData<Time>[];
}
