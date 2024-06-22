import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChartApi, ISeriesApi, Time } from "lightweight-charts";

interface TChartState {
  chart: IChartApi | null;
  candlestickSeries: ISeriesApi<"Candlestick", Time> | null;
  lineSeries: ISeriesApi<"Line", Time> | null;
}

const initState: TChartState = {
  chart: null,
  candlestickSeries: null,
  lineSeries: null,
};

export const TChartSlice = createSlice({
  name: "TChart",
  initialState: initState,
  reducers: {
    setChart(state, action: PayloadAction<IChartApi>) {
      state.chart = action.payload;
    },
    setCandlestickSeries(
      state,
      action: PayloadAction<ISeriesApi<"Candlestick", Time>>
    ) {
      state.candlestickSeries = action.payload;
    },
    setLineSeries(state, action: PayloadAction<ISeriesApi<"Line", Time>>) {
      state.lineSeries = action.payload;
    },
  },
});

export const { setChart, setCandlestickSeries, setLineSeries } =
  TChartSlice.actions;

export default TChartSlice.reducer;
