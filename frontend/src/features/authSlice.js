import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, getMyAccountsAPI } from "../service/api";

// =====================
// LOGIN
// =====================
export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =====================
// REGISTER
// =====================
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        pin: formData.pin,
      };

      const data = await registerUser(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =====================
// PROFILE
// =====================
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =====================
// ACCOUNTS
// =====================
export const fetchAccounts = createAsyncThunk(
  "auth/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyAccountsAPI();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =====================
// TRANSACTIONS
// =====================
export const fetchTransactions = createAsyncThunk(
  "auth/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =====================
// SLICE
// =====================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null,

    transactions: [],
    balance: 0,
    accounts: [],
    cards: [],
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.transactions = [];
      state.balance = 0;
      state.accounts = [];
      state.cards = [];
      localStorage.removeItem("token");
    },

    updateUser: (state, action) => {
      state.user = {
        ...(state.user || {}),
        ...action.payload,
      };
    },

    prependTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },

    setBalance: (state, action) => {
      state.balance = action.payload;
    },

    clearTransactions: (state) => {
      state.transactions = [];
    },

    setCardBlocked: (state, action) => {
      const { cardId, blocked } = action.payload || {};
      const card = state.cards.find((c) => c.id === cardId);
      if (card) card.blocked = blocked;
    },

    updateCardLimits: (state, action) => {
      const { cardId, limit } = action.payload || {};
      const card = state.cards.find((c) => c.id === cardId);
      if (card) card.limit = limit;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // ACCOUNTS
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload || [];
      })

      // TRANSACTIONS
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload || [];
      });
  },
});

// =====================
// EXPORTS
// =====================
export const {
  logout,
  updateUser,
  prependTransaction,
  setBalance,
  clearTransactions,
  setCardBlocked,
  updateCardLimits,
} = authSlice.actions;

export default authSlice.reducer;
