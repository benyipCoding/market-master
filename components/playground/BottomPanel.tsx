import React from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { BottomPanelContent, BottomPanelProps } from "../interfaces/Playground";
import OrdersPanel from "./OrdersPanel";
import OscillatorsPanel from "./OscillatorsPanel";
import { cn } from "@/lib/utils";

const BottomPanel: React.FC<BottomPanelProps> = ({ setDialogVisible }) => {
  const { panelContent } = useSelector((state: RootState) => state.bottomPanel);

  return (
    <div className={cn("bg-background flex-1 p-2 min-h-64")}>
      {panelContent === BottomPanelContent.Orders && (
        <OrdersPanel setDialogVisible={setDialogVisible} />
      )}
      {panelContent === BottomPanelContent.Oscillators && <OscillatorsPanel />}
    </div>
  );
};

export default BottomPanel;
