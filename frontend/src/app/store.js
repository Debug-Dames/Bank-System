import { configureStore } from '@reduxjs/toolkit'
import withdrawReducer from "../features/withdrawSlice";
import transactionsReducer from "../features/transactionSlice";

export const store = configureStore({
  reducer: {
    withdraw: withdrawReducer,
    transactions: transactionsReducer,
    // ...other slices
  },
});
