import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions } from "../service/mockApi";

export const fetchTransactions = createAsyncThunk(
  "auth/fetchTransactions",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const data = await getTransactions({ accountId });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load transactions");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    transactions: {
      status: "idle",
      error: null,
      items: [],
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.transactions = {
        status: "idle",
        error: null,
        items: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.status = "loading";
        state.transactions.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.status = "succeeded";
        state.transactions.items = action.payload.transactions || [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.status = "failed";
        state.transactions.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
