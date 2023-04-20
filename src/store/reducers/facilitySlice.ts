import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FacilityData {
  id: string;
  label: string;
  location: string;
}

export interface FacilityState {
  selected?: FacilityData;
}

const initialState: FacilityState = {
  selected: undefined,
};

export const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {
    setSelectedFacility: (state, action: PayloadAction<FacilityData | undefined>) => {
      state.selected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedFacility } = facilitySlice.actions;

