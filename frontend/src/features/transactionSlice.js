import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../service/api";

// FETCH TRANSACTIONS
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest("/transactions");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;