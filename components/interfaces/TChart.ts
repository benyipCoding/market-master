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
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dialogVisible: boolean;
  width: number | string;
}

export interface IChartContext {
  chart?: IChartApi;
  setChildSeries?: React.Dispatch<
    React.SetStateAction<ISeriesApi<SeriesType, Time>[]>
  >;
}

export interface TChartRef {
  chart: IChartApi;
  childSeries: ISeriesApi<SeriesType, Time>[];
  chartContainer: React.RefObject<HTMLDivElement>;
  dialogVisible: boolean;
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >;
  setChildSeries: React.Dispatch<
    React.SetStateAction<ISeriesApi<SeriesType, Time>[]>
  >;
}
