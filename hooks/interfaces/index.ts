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
} from "lightweight-charts";

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

declare module "lightweight-charts" {
  interface SeriesOptionsCommon {
    id: string;
  }
}
