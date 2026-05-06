import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import withdrawReducer from "../features/withdrawSlice";
import depositReducer from "../features/depositSlice";
import savingsReducer from "../features/savingsSlice";
import transactionReducer from "../features/transactionSlice";
import accountReducer from "../features/accountSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    withdraw: withdrawReducer,
    deposit: depositReducer,
    savings: savingsReducer,
    transactions: transactionReducer,
    accounts: accountReducer,
   
  },
});