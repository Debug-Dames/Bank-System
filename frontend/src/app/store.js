import { configureStore } from "@reduxjs/toolkit";
import depositReducer from "../features/depositSlice";

export const store = configureStore({
  reducer: {
    deposit: depositReducer,
  },
});