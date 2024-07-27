import {
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
} from "lightweight-charts";
import { TChartRef } from "./TChart";
import { TechnicalIndicatorLine } from "./TechnicalIndexForm";

export interface ButtonsProps {
  tChartRef: React.RefObject<TChartRef>;
  setDrawedLineList: React.Dispatch<
    React.SetStateAction<DeepPartial<LineStyleOptions & SeriesOptionsCommon>[]>
  >;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTechnicalIndicatorLines: React.Dispatch<
    React.SetStateAction<TechnicalIndicatorLine[]>
  >;
}
