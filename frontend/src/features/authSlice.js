import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTransactions } from "../service/transactions";
import { depositAsync } from "./depositSlice";
import { withdraw } from "./withdrawSlice";
import { getTransactionsAPI, getMyAccountsAPI } from "../service/api";

// Temporary local mock data
function getStoredCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const mockUser =
  getStoredCurrentUser() || {
    id: "user_001",
    firstName: "Test",
    lastName: "User",
    email: "test@bank.com",
  };

const mockAccount = {
  id: "OB — 0041 — 2025",
};

const mockCards = [
  {
    id: "card_physical_001",
    kind: "physical",
    label: "Physical Card",
    status: "Active",
    number: "5423123412341234",
    cvv: "407",
    expiry: "08/28",
    limits: { online: 5000, withdrawals: 2000 },
    blocked: false,
  },
  {
    id: "card_virtual_001",
    kind: "virtual",
    label: "Virtual Card",
    status: "Online",
    number: "5423567856785678",
    cvv: "912",
    expiry: "08/28",
    limits: { online: 8000, withdrawals: 0 },
    blocked: false,
  },
];

export const fetchTransactions = createAsyncThunk(
  "auth/fetchTransactions",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const data = await getTransactionsAPI(accountId);
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load transactions");
    }
  }
);

export const fetchAccounts = createAsyncThunk(
  "auth/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyAccountsAPI();
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load accounts");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: mockUser,
    account: mockAccount,
    accounts: {
      status: "idle",
      error: null,
      items: [],
    },
    balance: 0,
    cards: mockCards,
    transactions: {
      status: "idle",
      error: null,
      items: [],
    },
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.balance = 0;
      state.transactions = { status: "idle", error: null, items: [] };
      state.accounts = { status: "idle", error: null, items: [] };

      try {
        if (typeof window !== "undefined") {
          window.localStorage?.removeItem("token");
          window.localStorage?.removeItem("currentUser");
        }
      } catch {
        // ignore persistence failures
      }
    },

    updateUser: (state, action) => {
      const payload = action.payload || {};
      const safe = { ...payload };
      delete safe.pin;
      delete safe.password;
      delete safe.confirmPassword;

      state.user = { ...(state.user || {}), ...safe };

      try {
        if (typeof window !== "undefined") {
          window.localStorage?.setItem("currentUser", JSON.stringify(state.user));

          // Keep the registered profile in sync so changes persist across sign-out/sign-in.
          const rawRegistered = window.localStorage?.getItem("registeredUser");
          const registeredUser = rawRegistered ? JSON.parse(rawRegistered) : null;
          const sameUser =
            registeredUser &&
            (registeredUser.id && state.user?.id
              ? registeredUser.id === state.user.id
              : registeredUser.email && state.user?.email
                ? registeredUser.email === state.user.email
                : false);

          if (sameUser) {
            window.localStorage?.setItem(
              "registeredUser",
              JSON.stringify({ ...registeredUser, ...safe })
            );
          }
        }
      } catch {
        // ignore persistence failures
      }
    },

    setBalance: (state, action) => {
      const n = Number(action.payload);
      if (!Number.isFinite(n) || n < 0) return;
      state.balance = n;
    },

    clearTransactions: (state) => {
      if (!state.transactions) {
        state.transactions = { status: "succeeded", error: null, items: [] };
        return;
      }
      state.transactions.items = [];
      state.transactions.error = null;
      if (state.transactions.status === "idle") state.transactions.status = "succeeded";
    },

    prependTransaction: (state, action) => {
      const tx = action.payload;
      if (!tx) return;
      if (!state.transactions?.items) state.transactions = { status: "idle", error: null, items: [] };
      state.transactions.items.unshift(tx);
    },

    updateCardLimits: (state, action) => {
      const { cardId, limits } = action.payload || {};
      const card = state.cards?.find((c) => c.id === cardId);
      if (!card || !limits) return;

      const online = Number(limits.online);
      const withdrawals = Number(limits.withdrawals);

      if (Number.isFinite(online) && online >= 0) {
        card.limits = { ...(card.limits || {}), online };
      }
      if (Number.isFinite(withdrawals) && withdrawals >= 0) {
        card.limits = { ...(card.limits || {}), withdrawals };
      }
    },

    setCardBlocked: (state, action) => {
      const { cardId, blocked } = action.payload || {};
      const card = state.cards?.find((c) => c.id === cardId);
      if (!card) return;
      card.blocked = Boolean(blocked);
      card.status = card.blocked
        ? "Blocked"
        : card.kind === "virtual"
          ? "Online"
          : "Active";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.accounts.status = "loading";
        state.accounts.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts.status = "succeeded";
        state.accounts.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.accounts.status = "failed";
        state.accounts.error = action.payload || "Unable to load accounts";
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.status = "loading";
        state.transactions.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.status = "succeeded";
        const items = action.payload?.transactions || [];
        state.transactions.items = items;

        const latestBalance = Number(items?.[0]?.balanceAfter);
        if (Number.isFinite(latestBalance) && latestBalance >= 0) {
          state.balance = latestBalance;
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.status = "failed";
        state.transactions.error = action.payload || "Unable to load transactions";
      })
      .addCase(depositAsync.fulfilled, (state, action) => {
        const transaction = action.payload;
        if (!transaction) return;

        if (!state.transactions?.items) {
          state.transactions = { status: "idle", error: null, items: [] };
        }

        state.transactions.items = [
          transaction,
          ...state.transactions.items.filter(
            (item) => item.transactionId !== transaction.transactionId
          ),
        ];
        state.balance = transaction.balanceAfter;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        const transaction = action.payload;
        if (!transaction) return;

        if (!state.transactions?.items) {
          state.transactions = { status: "idle", error: null, items: [] };
        }

        state.transactions.items = [
          transaction,
          ...state.transactions.items.filter(
            (item) => item.transactionId !== transaction.transactionId
          ),
        ];
        state.balance = transaction.balanceAfter;
      });
  },
});

export const {
  logout,
  updateUser,
  setBalance,
  clearTransactions,
  prependTransaction,
  updateCardLimits,
  setCardBlocked,
} = authSlice.actions;
export default authSlice.reducer;
