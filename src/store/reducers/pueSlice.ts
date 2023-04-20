import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PueState {
  updateFrequencyMinutes: number;
}

const initialState: PueState = {
  updateFrequencyMinutes: 20,
};

export const pueSlice = createSlice({
  name: "pue",
  initialState,
  reducers: {
    setUpdateFrequencyMinutes: (state, action: PayloadAction<number>) => {
      state.updateFrequencyMinutes = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUpdateFrequencyMinutes } = pueSlice.actions;
