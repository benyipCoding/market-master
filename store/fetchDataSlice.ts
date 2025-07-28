import { getCategories } from "@/app/playground/actions/getCategories";
import { getPeriods } from "@/app/playground/actions/getPeriods";
import { getSymbols } from "@/app/playground/actions/getSymbols";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import { getFavSymbols } from "@/app/playground/actions/getFavSymbols";
import {
  OperationMode,
  Order,
  OrderStatus,
} from "@/components/interfaces/Playground";
import { getOrders } from "@/app/playground/actions/getOrders";
import { CandlestickData, Time } from "lightweight-charts";

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
  minMove: number;
  precision: number;
  isFav?: boolean;
  price_per_tick?: number;
}

interface FetchDataState {
  periods: Array<BaseLabelType> | null;
  symbols: Array<Symbol> | null;
  categories: Array<SymbolCategory> | null;
  currentPeriod: BaseLabelType | undefined;
  currentSymbol: Symbol | undefined;
  currentCategory: SymbolCategory | undefined;
  avgAmplitude: number | undefined;
  favSymIds: Array<number>;
  sliceLeft: number;
  sliceRight: number;
  isBackTestMode: boolean;
  isPreselect: boolean;
  hasVol: boolean;
  openingOrders: Order[];
  limitOrders: Order[];
  currentCandle: CandlestickData<Time> | undefined;
  operationMode: OperationMode;
  backTestRecordKey: string | undefined;
  closedOrders: Order[];
}

const initialState: FetchDataState = {
  periods: null,
  symbols: null,
  categories: null,
  currentPeriod: undefined,
  currentSymbol: undefined,
  currentCategory: undefined,
  avgAmplitude: undefined,
  favSymIds: [],
  sliceLeft: 0, // candlestickData.slice的第一个参数，逐渐减少到0
  sliceRight: 0, // candlestickData.slice的第二个参数，逐渐增加到数组长度
  isBackTestMode: false,
  isPreselect: false,
  hasVol: false,
  openingOrders: [],
  limitOrders: [],
  closedOrders: [],
  currentCandle: undefined,
  operationMode: OperationMode.PRACTISE,
  backTestRecordKey: undefined,
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

export const fetchFavSymbols = createAsyncThunk("fetch/favSymbols", () => {
  return getFavSymbols();
});

export const fetchOpeningOrders = createAsyncThunk(
  "fetch/openingOrders",
  (backtest_id: string) => {
    return getOrders({
      orderStatus: OrderStatus.EXECUTED,
      backtest_id,
    });
  }
);

export const fetchClosedOrders = createAsyncThunk(
  "fetch/closedOrders",
  (backtest_id: string) => {
    return getOrders({
      orderStatus: OrderStatus.CLOSED,
      backtest_id,
    });
  }
);

export const fetchLimitOrders = createAsyncThunk(
  "fetch/limitOrders",
  (backtest_id: string) => {
    return getOrders({
      orderStatus: OrderStatus.PENDING,
      backtest_id,
    });
  }
);

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
    setAvgAmplitude(state, action: PayloadAction<number>) {
      state.avgAmplitude = action.payload;
    },
    setCurrentSymbol(state, action: PayloadAction<number>) {
      state.currentSymbol = state.symbols?.find((s) => s.id === action.payload);
    },
    setCandleDataSlice(state, action: PayloadAction<number[]>) {
      action.payload[0] >= 0 && (state.sliceLeft = action.payload[0]);
      action.payload[1] && (state.sliceRight = action.payload[1]);
    },
    setIsBackTestMode(state, action: PayloadAction<boolean>) {
      state.isBackTestMode = action.payload;
    },
    setIsPreselect(state, action: PayloadAction<boolean>) {
      state.isPreselect = action.payload;
    },
    setHasVol(state, action: PayloadAction<boolean>) {
      state.hasVol = action.payload;
    },
    setCurrentCandle(state, action: PayloadAction<CandlestickData<Time>>) {
      state.currentCandle = action.payload;
    },
    setOperationMode(state, action: PayloadAction<OperationMode>) {
      state.operationMode = action.payload;
    },
    setBackTestRecordKey(state, action: PayloadAction<string | undefined>) {
      state.backTestRecordKey = action.payload;
    },
    clearOrders(state) {
      state.openingOrders = [];
      state.limitOrders = [];
      state.closedOrders = [];
    },
    setOpenOrdersPriceLineId(
      state,
      action: PayloadAction<{
        orderId: string;
        key: keyof Order;
        value: string;
      }>
    ) {
      const { orderId, key, value } = action.payload;
      state.openingOrders = state.openingOrders.map((o) => {
        const isTarget = o.id === orderId;
        if (!isTarget) return { ...o };
        return { ...o, [key]: value };
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPeriods.fulfilled, (state, action) => {
      state.periods = action.payload.data.filter((d: any) => d.label !== "H12"); // 过滤掉H12
      // 这部分功能挪到Navbar.tsx 483行
      // state.currentPeriod = (action.payload.data as BaseLabelType[]).find(
      //   (p) => p.label === "D1"
      // );
    });
    builder.addCase(fetchSymbols.fulfilled, (state, action) => {
      state.symbols = action.payload.data;
      // 这部分功能挪到Navbar.tsx 483行
      // state.currentSymbol = (action.payload.data as Symbol[]).find(
      //   (s) => s.label === "XAUUSD"
      // );
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      const arr: SymbolCategory[] = action.payload.data;
      arr.unshift({ id: 0, name: "All", parent_id: null });
      state.categories = arr;
      state.currentCategory = arr[0];
    });
    builder.addCase(fetchFavSymbols.fulfilled, (state, action) => {
      state.favSymIds = action.payload.data.fav_sym_ids;
    });
    builder.addCase(fetchOpeningOrders.fulfilled, (state, action) => {
      state.openingOrders = action.payload.data;
    });
    builder.addCase(fetchLimitOrders.fulfilled, (state, action) => {
      state.limitOrders = action.payload.data;
    });
    builder.addCase(fetchClosedOrders.fulfilled, (state, action) => {
      state.closedOrders = action.payload.data;
    });
  },
});

const selectCurrentSymbol = (state: RootState) => state.fetchData.currentSymbol;

export const symbolToSeriesOptions = createSelector(
  [selectCurrentSymbol],
  (currentSymbol) => ({
    id: currentSymbol?.label,
    toFixedNum: currentSymbol?.precision,
    priceFormat: {
      precision: currentSymbol?.precision,
      minMove: currentSymbol?.minMove,
    },
  })
);

export const {
  setCurrentPeriod,
  setCurrentCategory,
  setAvgAmplitude,
  setCurrentSymbol,
  setCandleDataSlice,
  setIsBackTestMode,
  setIsPreselect,
  setHasVol,
  setCurrentCandle,
  setOperationMode,
  setBackTestRecordKey,
  clearOrders,
  setOpenOrdersPriceLineId,
} = fetchDataSlice.actions;

export default fetchDataSlice.reducer;
