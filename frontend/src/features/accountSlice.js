import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAccounts } from "../service/account";

// FETCH ACCOUNTS
export const fetchAccounts = createAsyncThunk(
  "accounts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAccounts();

      return Array.isArray(res.data) ? res.data : res.data?.accounts || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load accounts"
      );
    }
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    selectedAccount: null,
    isLoading: false,
    error: null,
  },

  reducers: {
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },

    updateAccountBalance: (state, action) => {
      const { accountId, balance } = action.payload;

      // update selected account instantly
      if (state.selectedAccount?._id === accountId) {
        state.selectedAccount.availableBalance = balance;
      }

      // update list
      state.accounts = state.accounts.map((acc) =>
        acc._id === accountId
          ? { ...acc, availableBalance: balance }
          : acc
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.accounts = action.payload || [];
        
        // auto-select first account
        if (!state.selectedAccount && state.accounts.length > 0) {
          state.selectedAccount = state.accounts[0];
        }
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedAccount, updateAccountBalance } = accountSlice.actions;
export default accountSlice.reducer;
