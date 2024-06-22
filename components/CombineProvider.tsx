"use client";
import React, { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

const CombineProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default CombineProvider;
