import { TChartRef } from "@/components/interfaces/TChart";
import { createContext } from "react";

interface IDialogContext {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tChartRef?: React.RefObject<TChartRef>;
}

export const DialogContext = createContext<IDialogContext>({
  setDialogVisible: () => {},
});
