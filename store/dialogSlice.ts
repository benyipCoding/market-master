import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum DialogContentType {
  DrawedLineSettings = "Series Settings",
  TechnicalIndex = "Technical Indicator",
}

interface DialogSliceState {
  dialogContent: DialogContentType | undefined;
}

const initialState: DialogSliceState = {
  dialogContent: undefined,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialogContent(state, action: PayloadAction<DialogContentType>) {
      state.dialogContent = action.payload;
    },
  },
});

export const { setDialogContent } = dialogSlice.actions;

export default dialogSlice.reducer;
