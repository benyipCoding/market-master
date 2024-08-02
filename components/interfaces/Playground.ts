import {
  DeepPartial,
  LineStyleOptions,
  SeriesOptionsCommon,
} from "lightweight-charts";
import { TChartRef } from "./TChart";
import { TechnicalIndicatorLine } from "./TechnicalIndexForm";

export interface AsideProps {
  className?: string;
  asideOpen: boolean;
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
}

export interface NavbarProps {
  className?: string;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RightAsideBtnsProps {
  className?: string;
}
