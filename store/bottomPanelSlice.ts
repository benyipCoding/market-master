import { BottomPanelContent } from "@/components/interfaces/Playground";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BottomPanelState {
  panelContent: BottomPanelContent;
}

const initialState: BottomPanelState = {
  panelContent: BottomPanelContent.Orders,
};

export const bottomPanelSlice = createSlice({
  name: "bottomPanel",
  initialState,
  reducers: {
    setPanelContent(state, action: PayloadAction<BottomPanelContent>) {
      state.panelContent = action.payload;
    },
  },
});

export const { setPanelContent } = bottomPanelSlice.actions;

export default bottomPanelSlice.reducer;
