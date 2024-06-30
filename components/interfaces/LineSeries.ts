import { LineData, Time, LineSeriesPartialOptions } from "lightweight-charts";

export interface LineSeriesProps {
  seriesData?: LineData<Time>[];
  customSeriesOptions?: LineSeriesPartialOptions;
}
