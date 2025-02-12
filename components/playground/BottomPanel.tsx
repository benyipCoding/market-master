import React from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { BottomPanelContent } from "../interfaces/Playground";
import OrdersPanel from "./OrdersPanel";
import OscillatorsPanel from "./OscillatorsPanel";

const BottomPanel = () => {
  const { panelContent } = useSelector((state: RootState) => state.bottomPanel);

  return (
    <div className="bg-background min-h-52 flex-1 p-2 flex flex-col gap-2">
      {panelContent === BottomPanelContent.Orders && <OrdersPanel />}
      {panelContent === BottomPanelContent.Oscillators && <OscillatorsPanel />}
    </div>
  );
};

export default BottomPanel;
