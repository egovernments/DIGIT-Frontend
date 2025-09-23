import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./configSlice"; // we will create this next
export const store = configureStore({
  reducer: {
    config: configReducer, // add your slice
  },
});
