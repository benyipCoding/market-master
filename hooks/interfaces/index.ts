import { Equation } from "@/utils/helpers";
import {
  ISeriesApi,
  SeriesType,
  Time,
  IChartApi,
  LineSeriesPartialOptions,
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
  LineData,
} from "lightweight-charts";

declare module "lightweight-charts" {
  interface SeriesOptionsCommon {
    id: string;
    showLabel: boolean;
    toFixedNum: number;
  }
}
export interface IEnableDrawingLine {
  childSeries: ISeriesApi<SeriesType, Time>[];
  chart: IChartApi;
  drawedLineList: LineSeriesPartialOptions[];
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >;
}

export interface IDragLineSeries {
  dom: HTMLDivElement;
  baseSeries: ISeriesApi<SeriesType, Time>;
  chart: IChartApi;
  hoveringPoint: LineData<Time> | undefined;
  setLineId_equation: React.Dispatch<
    React.SetStateAction<Record<string, Equation>>
  >;
}
