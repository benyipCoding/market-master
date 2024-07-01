import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CommonState {
  isDrawing: boolean;
  mousePressing: boolean;
  isCanGrab: boolean;
}

const initState: CommonState = {
  isDrawing: false,
  mousePressing: false,
  isCanGrab: false,
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
    toggleIsCanGrab(state, action: PayloadAction<boolean>) {
      state.isCanGrab = action.payload;
    },
  },
});

export const { toggleDrawing, toggleMousePressing, toggleIsCanGrab } =
  commonSlice.actions;

export default commonSlice.reducer;
