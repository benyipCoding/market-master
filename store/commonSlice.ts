import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CommonState {
  isDrawing: boolean;
  mousePressing: boolean;
}

const initState: CommonState = {
  isDrawing: false,
  mousePressing: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState: initState,
  reducers: {
    toggleDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload;
    },
    toggleMousePressing(state, action: PayloadAction<boolean>) {
      state.mousePressing = action.payload;
    },
  },
});

export const { toggleDrawing, toggleMousePressing } = commonSlice.actions;

export default commonSlice.reducer;
