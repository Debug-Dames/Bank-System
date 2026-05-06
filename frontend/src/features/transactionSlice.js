import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions } from "../service/transactions";

// 🔥 REAL BACKEND CALL
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const data = await getTransactionsAPI(accountId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to load transactions"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    items: [],
  },
  reducers: {
    clearTransactions: (state) => {
      state.status = "idle";
      state.error = null;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";

        // 🔥 safer handling for different backend shapes
        state.items =
          action.payload?.transactions ||
          action.payload ||
          [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;