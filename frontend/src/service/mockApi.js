// Simulates backend API responses (mocked, in-memory).

// store transactions
let transactions = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Seeded transaction history so Transactions isn't empty on first load.
const seededTransactions = [
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

const txHistory = seededTransactions
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date));

let currentBalance =
  Number(txHistory?.[0]?.balanceAfter) ||
  Number(seededTransactions?.[seededTransactions.length - 1]?.balanceAfter) ||
  5000;

function requireDebit(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Amount must be greater than zero");
  if (n > currentBalance) throw new Error("Insufficient funds");
  return n;
}

function createElectricityToken() {
  const a = Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
  const b = Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
  return `${a}${b}`;
}

function recordTx(tx) {
  txHistory.unshift(tx);
  return tx;
}

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
  const n = requireDebit(amount);
  currentBalance -= n;
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "withdrawal",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
  });
};

// --- Airtime / Data / Electricity / Beneficiary payments ---
export const buyAirtime = async ({ accountId, provider, phone, amount }) => {
  await delay(800);
  const n = requireDebit(amount);
  currentBalance -= n;
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "airtime",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
    provider: String(provider || "").trim(),
    phone: String(phone || "").trim(),
  });
};

export const buyData = async ({ accountId, provider, phone, bundle, amount }) => {
  await delay(800);
  const n = requireDebit(amount);
  currentBalance -= n;
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "data",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
    provider: String(provider || "").trim(),
    phone: String(phone || "").trim(),
    bundle: String(bundle || "").trim(),
  });
};

export const buyElectricity = async ({ accountId, meterNumber, amount }) => {
  await delay(900);
  const n = requireDebit(amount);
  currentBalance -= n;
  const token = createElectricityToken();
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "electricity",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
    meterNumber: String(meterNumber || "").trim(),
    token,
  });
};

export const payBeneficiary = async ({
  accountId,
  beneficiaryName,
  bank,
  beneficiaryAccount,
  reference,
  amount,
}) => {
  await delay(1000);
  const n = requireDebit(amount);
  currentBalance -= n;
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "beneficiary",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
    beneficiaryName: String(beneficiaryName || "").trim(),
    bank: String(bank || "").trim(),
    beneficiaryAccount: String(beneficiaryAccount || "").trim(),
    reference: String(reference || "").trim(),
  });

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
  await delay(600);
  // IMPORTANT: never return the internal array reference (Redux dev-mode may freeze it).
  return {
    accountId,
    transactions: txHistory.map((tx) => ({ ...tx })).sort((a, b) => new Date(b.date) - new Date(a.date)),
  };
};

  await delay(500);



