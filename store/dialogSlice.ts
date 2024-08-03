import { TechnicalIndexItemTitleType } from "@/constants/technicalIndexList";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum DialogContentType {
  DrawedLineSettings = "Series Settings",
  TechnicalIndex = "Technical Indicator",
  IndicatorSettings = "Indicator Settings",
  SymbolSearch = "Symbol Search",
}

interface DialogSliceState {
  dialogContent: DialogContentType | undefined;
  recentlyIndicator: TechnicalIndexItemTitleType | undefined;
}

const initialState: DialogSliceState = {
  dialogContent: undefined,
  recentlyIndicator: undefined,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialogContent(state, action: PayloadAction<DialogContentType>) {
      state.dialogContent = action.payload;
    },
    setRecentlyIndicator(
      state,
      action: PayloadAction<TechnicalIndexItemTitleType>
    ) {
      state.recentlyIndicator = action.payload;
    },
  },
});

export const { setDialogContent, setRecentlyIndicator } = dialogSlice.actions;

export default dialogSlice.reducer;
