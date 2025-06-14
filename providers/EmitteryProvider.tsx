"use client";
import { createContext, PropsWithChildren } from "react";
import Emittery, { DatalessEventNames, OmnipresentEventData } from "emittery";

export interface IEmitterContext {
  emittery?: Emittery<
    Record<PropertyKey, any>,
    Record<PropertyKey, any> & OmnipresentEventData,
    DatalessEventNames<Record<PropertyKey, any>>
  >;
}

export const EmitteryContext = createContext<IEmitterContext>({});

const EmitteryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const emittery = new Emittery();

  return (
    <EmitteryContext.Provider value={{ emittery }}>
      {children}
    </EmitteryContext.Provider>
  );
};

export default EmitteryProvider;

export type EmitterEventType = {
  eventName?: OnApply;
};

export enum OnApply {
  Property = "apply_property",
  Data = "apply_data",
  ResetMainSeriesData = "reset_main_series_data",
}

export enum OnSeriesCreate {
  LineSeries = "lineSeriesCreate",
}

export enum OnContronPanel {
  exit = "panel_exit",
  nextTick = "panel_next_tick",
  prevTick = "pannel_previous_tick",
  stopPlaying = "stop_playing",
  cleanLineSeries = "clean_line_series",
}

export enum OnOrderMarker {
  add = "order_marker_add",
  removeAll = "order_marker_removeAll",
}

export enum OnPriceLine {
  add = "price_line_add",
  remove = "price_line_remove",
  update = "price_line_update",
  updatePanel = "price_line_update_panel",
  clear = "price_line_clear",
  dragEnd = "price_line_drag_end",
  retrive = "price_line_retrive",
  response = "price_line_response",
}

export enum OnStopLossAndTakeProfit {
  reset = "stopLoss_takeProfit_reset_active",
}

export enum OnCandlestickData {
  Loaded = "candlestick_data_loaded",
}

export enum OnLeftAside {
  AutoResize = "leftAside_autoResize",
}
