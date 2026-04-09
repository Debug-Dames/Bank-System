import { configureStore } from '@reduxjs/toolkit'
import withdrawReducer from "../features/withdrawSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    withdraw: withdrawReducer,
    auth: authReducer,
    // ...other slices
  },
});
