import { UpdatePriceLinePayload } from "@/components/interfaces/CandlestickSeries";
import { TechnicalIndexItemTitleType } from "@/constants/technicalIndexList";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum DialogContentType {
  DrawedLineSettings = "Series Settings",
  TechnicalIndex = "Technical Indicator",
  IndicatorSettings = "Indicator Settings",
  SymbolSearch = "Symbol Search",
  UploadData = "Upload Data",
  OrderActions = "Order Actions",
}

interface DialogSliceState {
  dialogContent: DialogContentType | undefined;
  recentlyIndicator: TechnicalIndexItemTitleType | undefined;
  currentOrderId: string | null;
  preStopPrice: number | undefined;
  preLimitPrice: number | undefined;
  priceLineIds: string[];
}

const initialState: DialogSliceState = {
  dialogContent: undefined,
  recentlyIndicator: undefined,
  currentOrderId: null,
  preStopPrice: undefined,
  preLimitPrice: undefined,
  priceLineIds: [],
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialogContent(
      state,
      action: PayloadAction<DialogContentType | undefined>
    ) {
      state.dialogContent = action.payload;
    },
    setRecentlyIndicator(
      state,
      action: PayloadAction<TechnicalIndexItemTitleType>
    ) {
      state.recentlyIndicator = action.payload;
    },
    setCurrentOrderId(state, action: PayloadAction<string | null>) {
      state.currentOrderId = action.payload;
    },
    setPreStopPrice(state, action: PayloadAction<number | undefined>) {
      // console.log("### setPreStopPrice", action.payload);
      state.preStopPrice = action.payload;
    },
    setPreLimitPrice(state, action: PayloadAction<number | undefined>) {
      // console.log("### setPreLimitPrice", action.payload);
      state.preLimitPrice = action.payload;
    },
    setPriceLineIds(state, action: PayloadAction<string | null>) {
      if (!action.payload) {
        state.priceLineIds = [];
      } else {
        const isExisted = state.priceLineIds.some(
          (id) => id === action.payload
        );
        if (!isExisted) {
          state.priceLineIds = [...state.priceLineIds, action.payload];
        }
      }
    },
  },
});

export const {
  setDialogContent,
  setRecentlyIndicator,
  setCurrentOrderId,
  setPreStopPrice,
  setPreLimitPrice,
  setPriceLineIds,
} = dialogSlice.actions;

export default dialogSlice.reducer;
