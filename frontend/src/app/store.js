import { configureStore } from '@reduxjs/toolkit'
import withdrawReducer from "../features/withdrawSlice";

export const store = configureStore({
  reducer: {
    withdraw: withdrawReducer,
    // ...other slices
  },
});