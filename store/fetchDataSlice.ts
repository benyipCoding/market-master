import { getPeriods } from "@/app/playground/getPeriods";
import { getSymbols } from "@/app/playground/getSymbols";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface FetchDataState {
  periods: Array<{ id: number; label: string }> | null;
  symbols: Array<{ id: number; label: string }> | null;
}

const initialState: FetchDataState = {
  periods: null,
  symbols: null,
};

export const fetchPeriods = createAsyncThunk("fetch/periods", () => {
  return getPeriods();
});

export const fetchSymbols = createAsyncThunk("fetch/symbols", () => {
  return getSymbols();
});

export const fetchDataSlice = createSlice({
  name: "fetchData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchPeriods.fulfilled, (state, action) => {
      state.periods = action.payload.data;
    });
    builder.addCase(fetchSymbols.fulfilled, (state, action) => {
      state.symbols = action.payload.data;
    });
  },
});

export default fetchDataSlice.reducer;
