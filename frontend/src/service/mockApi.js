// Simulates backend API responses during Sprint 1.
const MOCK_BALANCE = 7100.0;
let currentBalance = MOCK_BALANCE;
const transactions = [
  {
    transactionId: "txn_20260328_001",
    type: "deposit",
    amount: 1200.0,
    balanceAfter: 6200.0,
    date: "2026-03-28T09:14:00.000Z",
  },
  {
    transactionId: "txn_20260330_002",
    type: "withdrawal",
    amount: 350.0,
    balanceAfter: 5850.0,
    date: "2026-03-30T16:40:00.000Z",
  },
  {
    transactionId: "txn_20260402_003",
    type: "deposit",
    amount: 800.0,
    balanceAfter: 6650.0,
    date: "2026-04-02T07:22:00.000Z",
  },
  {
    transactionId: "txn_20260405_004",
    type: "withdrawal",
    amount: 500.0,
    balanceAfter: 6150.0,
    date: "2026-04-05T13:05:00.000Z",
  },
  {
    transactionId: "txn_20260408_005",
    type: "deposit",
    amount: 950.0,
    balanceAfter: 7100.0,
    date: "2026-04-08T11:11:00.000Z",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth ---
export const loginUser = async () => {
  
};

export const registerUser = async () => {
  
};

// --- Balance ---
export const getBalance = async ({ accountId }) => {
  await delay(500);
  return { accountId, balance: currentBalance };
};

// --- Deposit ---
export const depositFunds = async ({ accountId, amount }) => {
  
};

// --- Withdraw ---
export const withdrawFunds = async ({ accountId, amount }) => {
  await delay(900);
  if (!amount || amount <= 0) throw new Error("Amount must be greater than zero");
  if (parseFloat(amount) > currentBalance) throw new Error("Insufficient funds");
  currentBalance -= parseFloat(amount);
  const transaction = {
    transactionId: `txn_${Date.now()}`,
    type: "withdrawal",
    amount: parseFloat(amount),
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
  };
  transactions.unshift(transaction);
  return transaction;
};

// --- Transactions ---
export const getTransactions = async ({ accountId }) => {
  await delay(600);
  return {
    accountId,
    transactions: [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ),
  };
};
