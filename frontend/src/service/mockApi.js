// Mock user
export const mockUser = {
  id: "u1",
  name: "Minenhle",
  email: "minenhle@example.com",
};

// Mock balance
export let mockBalance = 10000;

// Mock transactions
export let mockTransactions = [
  {
    id: "t1",
    type: "deposit",
    amount: 500,
    date: "2026-04-01T10:00:00Z",
    status: "completed",
  },
  {
    id: "t2",
    type: "withdraw",
    amount: 200,
    date: "2026-04-02T14:30:00Z",
    status: "completed",
  },
];

export const depositMoney = async (amount) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Invalid deposit amount");
  }

  const transaction = {
    id: `t${Date.now()}`,
    type: "deposit",
    amount: Number(amount),
    date: new Date().toISOString(),
    status: "completed",
  };

  mockBalance += Number(amount);
  mockTransactions.push(transaction);

  return { transaction };
};