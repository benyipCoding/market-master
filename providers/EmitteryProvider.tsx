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
  add = "add",
}
