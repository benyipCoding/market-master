import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CommonState {
  isDrawing: boolean;
}

const initState: CommonState = {
  isDrawing: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState: initState,
  reducers: {
    toggleDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload;
    },
  },
});

export const { toggleDrawing } = commonSlice.actions;

export default commonSlice.reducer;
