import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../service/api";

// FETCH BALANCE
export const fetchBalance = createAsyncThunk(
  "balance/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest("/account/balance");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    balance: 0,
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default balanceSlice.reducer;