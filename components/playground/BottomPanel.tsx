import React from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { BottomPanelContent } from "../interfaces/Playground";
import OrdersPanel from "./OrdersPanel";
import OscillatorsPanel from "./OscillatorsPanel";
import { cn } from "@/lib/utils";

const BottomPanel = () => {
  const { panelContent } = useSelector((state: RootState) => state.bottomPanel);

  return (
    <div className={cn("bg-background flex-1 p-2 min-h-60")}>
      {panelContent === BottomPanelContent.Orders && <OrdersPanel />}
      {panelContent === BottomPanelContent.Oscillators && <OscillatorsPanel />}
    </div>
  );
};

export default BottomPanel;
