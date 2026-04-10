import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import withdrawReducer from "../features/withdrawSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    withdraw: withdrawReducer,
    
  },
});