import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice";
import dialogReducer from "./dialogSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    dialog: dialogReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
