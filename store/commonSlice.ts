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
  mouseDblClickEventParam?: MouseEventParams<Time>;
  selectedSeries: ISeriesApi<SeriesType, Time> | null;
  hoveringSeries: ISeriesApi<SeriesType, Time> | null;
}

const initState: CommonState = {
  isDrawing: false,
  mousePressing: false,
  selectedSeries: null,
  hoveringSeries: null,
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
    setMouseDblClickEventParam(
      state,
      action: PayloadAction<MouseEventParams<Time>>
    ) {
      state.mouseDblClickEventParam = action.payload;
    },
    setSelectedSeries(
      state,
      action: PayloadAction<ISeriesApi<SeriesType, Time> | null>
    ) {
      state.selectedSeries = action.payload;
    },
    setHoveringSeries(
      state,
      action: PayloadAction<ISeriesApi<SeriesType, Time> | null>
    ) {
      state.hoveringSeries = action.payload;
    },
  },
});

export const {
  toggleDrawing,
  toggleMousePressing,
  setMouseMovingEventParam,
  setMouseClickEventParam,
  setSelectedSeries,
  setHoveringSeries,
  setMouseDblClickEventParam,
} = commonSlice.actions;

export default commonSlice.reducer;
