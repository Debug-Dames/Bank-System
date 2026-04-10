// Simulates backend API responses during Sprint 1.

const MOCK_BALANCE = 5000.0;
let currentBalance = MOCK_BALANCE;

// store transactions
let transactions = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth ---
export const loginUser = async () => {
  await delay(500);

  return {
    token: "mock-token",
    user: {
      id: "u1",
      name: "User",
      email: "user@mail.com",
    },
  };
};

export const registerUser = async () => {
  await delay(700);

  return {
    success: true,
    message: "User registered successfully",
  };
};

// --- Balance ---
export const getBalance = async ({ accountId }) => {
  await delay(500);

  return {
    accountId,
    balance: currentBalance,
  };
};

// --- Deposit ---
export const depositFunds = async ({ accountId, amount }) => {
  await delay(800);

  const numericAmount = parseFloat(amount);

  if (!numericAmount || numericAmount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  currentBalance += numericAmount;

  const transaction = {
    transactionId: `txn_${Date.now()}`,
    type: "deposit",
    amount: numericAmount,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
  };

  transactions.unshift(transaction);

  return transaction;
};

// --- Withdraw ---
export const withdrawFunds = async ({ accountId, amount }) => {
  await delay(900);

  const numericAmount = parseFloat(amount);

  if (!numericAmount || numericAmount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (numericAmount > currentBalance) {
    throw new Error("Insufficient funds");
  }

  currentBalance -= numericAmount;

  const transaction = {
    transactionId: `txn_${Date.now()}`,
    type: "withdrawal",
    amount: numericAmount,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
  };

  transactions.unshift(transaction);

  return transaction;
};

// --- Transactions ---
export const getTransactions = async ({ accountId }) => {
  await delay(500);

  return transactions;
};