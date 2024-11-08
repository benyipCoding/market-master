import { getCategories } from "@/app/playground/actions/getCategories";
import { getPeriods } from "@/app/playground/actions/getPeriods";
import { getSymbols } from "@/app/playground/actions/getSymbols";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type BaseLabelType = { id: number; label: string };
export interface SymbolCategory {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface Symbol {
  id: number;
  label: string;
  category_id: number;
  description: string;
  basic_point_place: number;
}

interface FetchDataState {
  periods: Array<BaseLabelType> | null;
  symbols: Array<Symbol> | null;
  categories: Array<SymbolCategory> | null;
  currentPeriod: BaseLabelType | undefined;
  currentSymbol: Symbol | undefined;
  currentCategory: SymbolCategory | undefined;
}

const initialState: FetchDataState = {
  periods: null,
  symbols: null,
  categories: null,
  currentPeriod: undefined,
  currentSymbol: undefined,
  currentCategory: undefined,
};

export const fetchPeriods = createAsyncThunk("fetch/periods", () => {
  return getPeriods();
});

export const fetchSymbols = createAsyncThunk("fetch/symbols", () => {
  return getSymbols();
});

export const fetchCategories = createAsyncThunk("fetch/categories", () => {
  return getCategories();
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
    setCurrentCategory(state, action: PayloadAction<SymbolCategory>) {
      state.currentCategory = action.payload;
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
      state.currentSymbol = (action.payload.data as Symbol[]).find(
        (s) => s.label === "XAUUSD"
      );
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      const arr: SymbolCategory[] = action.payload.data;
      arr.unshift({ id: 0, name: "All", parent_id: null });
      state.categories = arr;
      state.currentCategory = arr[0];
    });
  },
});

export const { setCurrentPeriod, setCurrentCategory } = fetchDataSlice.actions;

export default fetchDataSlice.reducer;
