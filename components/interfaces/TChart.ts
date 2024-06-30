import { Equation } from "@/utils/helpers";
import {
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
  LineSeriesPartialOptions,
  IChartApi,
  ISeriesApi,
  SeriesType,
  Time,
} from "lightweight-charts";

export interface TChartProps {
  className: string;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  drawable?: boolean;
  drawedLineList: LineSeriesPartialOptions[];
}

export interface IChartContext {
  chart?: IChartApi;
  setChildSeries?: React.Dispatch<
    React.SetStateAction<ISeriesApi<SeriesType, Time>[]>
  >;
  selectedSeries?: ISeriesApi<SeriesType, Time> | null;
}

export interface TChartRef {
  chart: IChartApi;
  childSeries: ISeriesApi<SeriesType, Time>[];
  lineId_equation: Record<string, Equation>;
  selectedSeries: ISeriesApi<SeriesType, Time>;
  setSelectedSeries: React.Dispatch<
    React.SetStateAction<ISeriesApi<SeriesType, Time> | null>
  >;
}
