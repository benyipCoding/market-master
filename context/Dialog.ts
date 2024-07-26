import { TChartRef } from "@/components/interfaces/TChart";
import { TechnicalIndicatorLine } from "@/components/interfaces/TechnicalIndexForm";
import { createContext } from "react";

interface IDialogContext {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tChartRef?: React.RefObject<TChartRef>;
  setTechnicalIndicatorLines: React.Dispatch<
    React.SetStateAction<TechnicalIndicatorLine[]>
  >;
}

export const DialogContext = createContext<IDialogContext>({
  setDialogVisible: () => {},
  setTechnicalIndicatorLines: () => {},
});
