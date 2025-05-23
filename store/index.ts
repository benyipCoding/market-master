import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice";
import dialogReducer from "./dialogSlice";
import fetchDataReducer from "./fetchDataSlice";
import bottomPanelReducer from "./bottomPanelSlice";
import asideReducer from "./asideSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    dialog: dialogReducer,
    fetchData: fetchDataReducer,
    bottomPanel: bottomPanelReducer,
    aside: asideReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
