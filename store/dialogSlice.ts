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
}

const initialState: DialogSliceState = {
  dialogContent: undefined,
  recentlyIndicator: undefined,
  currentOrderId: null,
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
  },
});

export const { setDialogContent, setRecentlyIndicator, setCurrentOrderId } =
  dialogSlice.actions;

export default dialogSlice.reducer;
