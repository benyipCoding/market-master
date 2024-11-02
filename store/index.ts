import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice";
import dialogReducer from "./dialogSlice";
import fetchDataReducer from "./fetchDataSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    dialog: dialogReducer,
    fetchData: fetchDataReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
