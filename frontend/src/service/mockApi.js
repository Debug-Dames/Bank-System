// Simulates backend API responses (mocked, in-memory).

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Seeded transaction history so Transactions isn't empty on first load.
// IMPORTANT: keep the latest seeded balance at R 5000 to match the app default.
const seededTransactions = [
  {
    transactionId: "txn_20260401_001",
    type: "deposit",
    amount: 1500.0,
    balanceAfter: 6500.0,
    date: "2026-04-01T09:14:00.000Z",
  },
  {
    transactionId: "txn_20260406_002",
    type: "withdrawal",
    amount: 500.0,
    balanceAfter: 6000.0,
    date: "2026-04-06T16:40:00.000Z",
  },
  {
    transactionId: "txn_20260412_003",
    type: "withdrawal",
    amount: 1000.0,
    balanceAfter: 5000.0,
    date: "2026-04-12T11:11:00.000Z",
  },
];

const txHistory = seededTransactions
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date));

let currentBalance = Number(txHistory?.[0]?.balanceAfter) || 5000;
 
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

function createCashCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createCashSendReference() {
  const y = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  return `CS-${y}-${rand}`;
}

function requirePin(pin) {
  const raw = String(pin ?? "").trim();
  if (!/^\d{4,6}$/.test(raw)) throw new Error("PIN must be 4 to 6 digits");
  return raw;
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
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "deposit",
    amount: numericAmount,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
  });
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
};

export const sendCash = async ({ accountId, recipientName, phone, reference, amount, pin }) => {
  await delay(900);
  const n = requireDebit(amount);
  requirePin(pin);
  currentBalance -= n;
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(); // 72 hours
  return recordTx({
    transactionId: `txn_${Date.now()}`,
    type: "sendcash",
    amount: n,
    balanceAfter: currentBalance,
    date: new Date().toISOString(),
    accountId,
    recipientName: String(recipientName || "").trim(),
    phone: String(phone || "").trim(),
    reference: String(reference || "").trim(),
    cashCode: createCashCode(),
    referenceNumber: createCashSendReference(),
    expiresAt,
  });
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
