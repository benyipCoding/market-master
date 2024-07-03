import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ISeriesApi,
  MouseEventParams,
  SeriesType,
  Time,
} from "lightweight-charts";

interface CommonState {
  isDrawing: boolean;
  mousePressing: boolean;
  mouseMovingEventParam?: MouseEventParams<Time>;
  mouseClickEventParam?: MouseEventParams<Time>;
  selectedSeries: ISeriesApi<SeriesType, Time> | null;
}

const initState: CommonState = {
  isDrawing: false,
  mousePressing: false,
  selectedSeries: null,
};

export const commonSlice = createSlice({
  name: "common",
  initialState: initState,
  reducers: {
    toggleDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload;
    },
    toggleMousePressing(state, action: PayloadAction<boolean>) {
      state.mousePressing = action.payload;
    },
    setMouseMovingEventParam(
      state,
      action: PayloadAction<MouseEventParams<Time>>
    ) {
      state.mouseMovingEventParam = action.payload;
    },
    setMouseClickEventParam(
      state,
      action: PayloadAction<MouseEventParams<Time>>
    ) {
      state.mouseClickEventParam = action.payload;
    },
    setSelectedSeries(
      state,
      action: PayloadAction<ISeriesApi<SeriesType, Time> | null>
    ) {
      state.selectedSeries = action.payload;
    },
  },
});

export const {
  toggleDrawing,
  toggleMousePressing,
  setMouseMovingEventParam,
  setMouseClickEventParam,
  setSelectedSeries,
} = commonSlice.actions;

export default commonSlice.reducer;
