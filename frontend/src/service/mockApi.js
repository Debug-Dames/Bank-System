// Simulates backend API responses during Sprint 1.
const MOCK_BALANCE = 5000.0;
let currentBalance = MOCK_BALANCE;

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
  return {
    transactionId: `txn_${Date.now()}`,
    type: "withdrawal",
    amount: parseFloat(amount),
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
  };
};

// --- Transactions ---
export const getTransactions = async ({ accountId }) => {
 
};
