import { createSlice } from "@reduxjs/toolkit";

// Temporary local mock data (replaces removed exports from mockApi)
const mockUser = {
  id: "user_001",
  name: "Test User",
  email: "test@bank.com",
};

const mockAccount = {
  id: "OB — 0041 — 2025",
};

const mockBalance = 5000;

const mockTransactions = [];

const mockSavingsPlans = [];

const mockCards = [
  {
    id: "card_physical_001",
    kind: "physical",
    label: "Physical Card",
    status: "Active",
    number: "5423123412341234",
    cvv: "407",
    expiry: "08/28",
    limits: {
      online: 5000,
      withdrawals: 2000,
    },
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
    limits: {
      online: 8000,
      withdrawals: 0,
    },
    blocked: false,
  },
];

const initialState = {
  user: mockUser,
  account: mockAccount,
  balance: mockBalance,
  transactions: mockTransactions,
  savingsPlans: mockSavingsPlans,
  cards: mockCards,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
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
      card.status = card.blocked ? "Blocked" : card.kind === "virtual" ? "Online" : "Active";
    },

    addSavingsPlan: (state, action) => {
      const payload = action.payload || {};
      const name = String(payload.name || "").trim();
      const target = Number(payload.target || 0);

      if (!name || !Number.isFinite(target) || target <= 0) return;

      state.savingsPlans.unshift({
        id: `s${Date.now()}`,
        name,
        target,
        balance: 0,
      });
    },

    transferToSavingsPlan: (state, action) => {
      const { planId, amount } = action.payload || {};
      const plan = state.savingsPlans.find((p) => p.id === planId);
      const n = Number(amount || 0);

      if (!plan || !Number.isFinite(n) || n <= 0) return;
      if (state.balance < n) return;

      state.balance -= n;
      plan.balance += n;

      state.transactions.unshift({
        id: `t${Date.now()}`,
        type: "transfer",
        amount: n,
        date: new Date().toISOString().slice(0, 10),
        status: "completed",
        note: `Transfer to savings: ${plan.name}`,
      });
    },
  },
});

export const {
  updateUser,
  addSavingsPlan,
  transferToSavingsPlan,
  updateCardLimits,
  setCardBlocked,
} = authSlice.actions;

export default authSlice.reducer;
