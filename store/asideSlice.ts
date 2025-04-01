import { AsideContent } from "@/components/interfaces/Playground";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AsideSliceState {
  currentAside: AsideContent | "";
}

const initialState: AsideSliceState = {
  currentAside: AsideContent.Trade,
};

const asideSlice = createSlice({
  name: "aside",
  initialState,
  reducers: {
    setCurrentAside(state, action: PayloadAction<AsideContent | "">) {
      state.currentAside = action.payload;
    },
  },
});

export const { setCurrentAside } = asideSlice.actions;

export default asideSlice.reducer;
