export const mockUser = {
  id: "u1",
  name: "Comfort Ngwenya",
  email: "comfort@example.com",
  phone: "0812345678",
  address: "123 Main Street, Cape Town"
};

export const mockBalance = 12500;

export const mockTransactions = [
  {
    id: "t1",
    type: "deposit",
    amount: 500,
    date: "2026-04-01",
    status: "completed"
  },
  {
    id: "t2",
    type: "withdraw",
    amount: 200,
    date: "2026-04-02",
    status: "completed"
  },
  {
    id: "t3",
    type: "deposit",
    amount: 1500,
    date: "2026-03-18",
    status: "completed"
  },
  {
    id: "t4",
    type: "withdraw",
    amount: 350,
    date: "2026-03-22",
    status: "completed"
  },
  {
    id: "t5",
    type: "deposit",
    amount: 800,
    date: "2026-02-10",
    status: "completed"
  }
];

export const mockSavingsPlans = [
  {
    id: "s1",
    name: "Emergency Fund",
    target: 20000,
    balance: 3500
  },
  {
    id: "s2",
    name: "Holiday",
    target: 12000,
    balance: 1800
  }
];
