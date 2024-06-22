import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice";
import TChartReducer from "./TChartSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    // TChart: TChartReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
