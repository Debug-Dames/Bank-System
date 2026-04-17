import User from "../models/User.js";

// GET BALANCE
export const getUserBalance = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return { balance: user.balance };
};

// DEPOSIT
export const depositAmount = async (userId, amount) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.balance += amount;
  await user.save();

  return {
    message: "Deposit successful",
    balance: user.balance,
  };
};

// WITHDRAW
export const withdrawAmount = async (userId, amount) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.balance < amount) {
    throw new Error("Insufficient funds");
  }

  user.balance -= amount;
  await user.save();

  return {
    message: "Withdrawal successful",
    balance: user.balance,
  };
};