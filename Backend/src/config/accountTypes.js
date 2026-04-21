export const ACCOUNT_TYPE_CONFIG = {
  transactional: {
    label: "Transactional Account",
    description: "Day-to-day banking account",
    features: ["ATM access", "Debit card", "Online banking"],
    minIncome: 0,
  },
  savings: {
    label: "Savings Account",
    description: "Account designed for saving money with interest",
    features: ["Interest earnings", "No monthly fees", "ATM withdrawals"],
    minIncome: 0,
  },
  current: {
    label: "Current Account",
    description: "Business or high-volume account",
    features: ["Overdraft facility", "Cheque book", "Priority support"],
    minIncome: 5000,
  },
  platinum: {
    label: "Platinum Account",
    description: "Exclusive account",
    features: ["Dedicated banker", "Travel insurance"],
    minIncome: 20000,
  },
};