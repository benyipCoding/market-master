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
  Roger = "apply_roger",
}
