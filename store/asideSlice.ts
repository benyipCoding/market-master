import { OrderType } from "@/components/interfaces/CandlestickSeries";
import { AsideContent } from "@/components/interfaces/Playground";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AsideSliceState {
  currentAside: AsideContent | "";
  currentOrderType: OrderType;
}

const initialState: AsideSliceState = {
  currentAside: AsideContent.Trade,
  currentOrderType: OrderType.MARKET,
};

const asideSlice = createSlice({
  name: "aside",
  initialState,
  reducers: {
    setCurrentAside(state, action: PayloadAction<AsideContent | "">) {
      state.currentAside = action.payload;
    },
    setCurrentOrderType(state, action: PayloadAction<OrderType>) {
      state.currentOrderType = action.payload;
    },
  },
});

export const { setCurrentAside, setCurrentOrderType } = asideSlice.actions;

export default asideSlice.reducer;
