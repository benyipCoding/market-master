import {
  BottomPanelContent,
  OrderTabs,
} from "@/components/interfaces/Playground";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BottomPanelState {
  panelContent: BottomPanelContent;
  currentOrderTab: OrderTabs | "";
}

const initialState: BottomPanelState = {
  panelContent: BottomPanelContent.Orders,
  currentOrderTab: OrderTabs.Opening,
};

export const bottomPanelSlice = createSlice({
  name: "bottomPanel",
  initialState,
  reducers: {
    setPanelContent(state, action: PayloadAction<BottomPanelContent>) {
      state.panelContent = action.payload;
    },
    setCurrentOrderTab(state, action: PayloadAction<OrderTabs | "">) {
      state.currentOrderTab = action.payload;
    },
  },
});

export const { setPanelContent, setCurrentOrderTab } = bottomPanelSlice.actions;

export default bottomPanelSlice.reducer;
