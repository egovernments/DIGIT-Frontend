import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "config",
  initialState: { data: null },
  reducers: {
    saveConfig: (state, action) => {
      state.data = action.payload; // store data in redux
    },
  },
});

export const { saveConfig } = configSlice.actions;
export default configSlice.reducer;
