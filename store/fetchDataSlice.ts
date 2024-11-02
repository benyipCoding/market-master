import { getPeriods } from "@/app/playground/actions/getPeriods";
import { getSymbols } from "@/app/playground/actions/getSymbols";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type BaseLabelType = { id: number; label: string };

interface FetchDataState {
  periods: Array<BaseLabelType> | null;
  symbols: Array<BaseLabelType> | null;
  currentPeriod: BaseLabelType | undefined;
  currentSymbol: BaseLabelType | undefined;
}

const initialState: FetchDataState = {
  periods: null,
  symbols: null,
  currentPeriod: undefined,
  currentSymbol: undefined,
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
  reducers: {
    setCurrentPeriod(state, action: PayloadAction<string>) {
      state.currentPeriod = state.periods?.find(
        (p) => `${p.id}` === action.payload
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPeriods.fulfilled, (state, action) => {
      state.periods = action.payload.data;
      state.currentPeriod = (action.payload.data as BaseLabelType[]).find(
        (p) => p.label === "D1"
      );
    });
    builder.addCase(fetchSymbols.fulfilled, (state, action) => {
      state.symbols = action.payload.data;
      state.currentSymbol = (action.payload.data as BaseLabelType[]).find(
        (s) => s.label === "XAUUSD"
      );
    });
  },
});

export const { setCurrentPeriod } = fetchDataSlice.actions;

export default fetchDataSlice.reducer;
