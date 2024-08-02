import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ISeriesApi,
  MouseEventParams,
  SeriesType,
  Time,
} from "lightweight-charts";

export enum GraphType {
  LineSegment = "line_segment",
  Horizontal = "horizontal_line",
}

interface CommonState {
  isDrawing: boolean;
  graphType: GraphType | "";
  mousePressing: boolean;
  mouseMovingEventParam?: MouseEventParams<Time>;
  mouseClickEventParam?: MouseEventParams<Time>;
  mouseDblClickEventParam?: MouseEventParams<Time>;
  selectedSeries: ISeriesApi<SeriesType, Time> | null;
  hoveringSeries: ISeriesApi<SeriesType, Time> | null;
  hoveringIndicator: ISeriesApi<SeriesType, Time> | null;
  selectedIndicator: ISeriesApi<SeriesType, Time> | null;
}

const initState: CommonState = {
  isDrawing: false,
  mousePressing: false,
  selectedSeries: null,
  hoveringSeries: null,
  hoveringIndicator: null,
  selectedIndicator: null,
  graphType: "",
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
    setHoveringIndicator(
      state,
      action: PayloadAction<ISeriesApi<SeriesType, Time> | null>
    ) {
      state.hoveringIndicator = action.payload;
    },
    setSelectedIndicator(
      state,
      action: PayloadAction<ISeriesApi<SeriesType, Time> | null>
    ) {
      state.selectedIndicator = action.payload;
    },
    setGraphType(state, action: PayloadAction<GraphType | "">) {
      state.graphType = action.payload;
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
  setHoveringIndicator,
  setSelectedIndicator,
  setGraphType,
} = commonSlice.actions;

export default commonSlice.reducer;
