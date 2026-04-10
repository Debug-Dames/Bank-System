import { configureStore } from '@reduxjs/toolkit'
import withdrawReducer from "../features/withdrawSlice";
import depositReducer from "../features/depositSlice";

export const store = configureStore({
  reducer: {
    withdraw: withdrawReducer,
    deposit: depositReducer,
  },
});