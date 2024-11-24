import { CalculatePriceType } from "@/components/commonFormItem/PeriodItem";
import { TChartRef } from "@/components/interfaces/TChart";
import { TechnicalIndexItemTitleType } from "@/constants/technicalIndexList";
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

export enum CustomLineSeriesType {
  Drawed = "drawed",
  Indicator = "indicator",
  AutomaticDrawed = "automaticDrawed",
  SegmentDrawed = "segmentDrawed",
  GreatSegmentDrawed = "greateSegmentDrawed",
}

declare module "lightweight-charts" {
  interface SeriesOptionsCommon {
    id: string;
    showLabel: boolean;
    toFixedNum: number;
    customTitle: string;
    customType?: CustomLineSeriesType;
    indicator?: TechnicalIndexItemTitleType;
    period?: number;
    calculatePrice?: CalculatePriceType;
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

export interface AutomaticLineDrawingArgs {
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  tChartRef: React.RefObject<TChartRef>;
}

export type AutomaticLinePoint = { index?: number; time: Time; price: number };

export enum TrendType {
  Up = 1,
  Down = -1,
}

// 笔和线段的共同抽象类型
export interface LineState {
  startPoint: AutomaticLinePoint;
  endPoint: AutomaticLinePoint;
  trend: TrendType;
  type?: CustomLineSeriesType;
}
