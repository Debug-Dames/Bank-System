import User from "../models/User.js";
import { Account, Card, Activity } from "../models/index.js";
import { ACCOUNT_TYPES } from "../models/Account.js";
import {
  validateSAIdNumber,
  validatePhoneNumber,
  normalizePhone,
} from "../utils/validators.js";
import { ACCOUNT_TYPE_CONFIG } from "../config/accountTypes.js";


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



/**
 * Get all accounts for the logged-in user
 */
export const getUserAccounts = async (userId) => {
  const accounts = await Account.find({ userId, status: { $ne: "closed" } }).sort({
    openedAt: 1,
  });
  return accounts;
};

/**
 * Get a single account by ID (with ownership check)
 */
export const getAccountById = async (accountId, userId) => {
  const account = await Account.findById(accountId);

  if (!account) {
    const error = new Error("Account not found");
    error.statusCode = 404;
    throw error;
  }

  if (account.userId.toString() !== userId.toString()) {
    const error = new Error("You do not have access to this account");
    error.statusCode = 403;
    throw error;
  }

  return account;
};

/**
 * Open a new account for a user
 * Validates income eligibility based on account type
 */
export const openAccount = async (userId, data) => {
  const { citizenId, firstName, lastName, phoneNumber, monthlyIncome, accountType } =
    data;

  

  // --- Validation ---
  if (!citizenId || !firstName || !lastName || !phoneNumber || !accountType) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (!ACCOUNT_TYPES.includes(accountType)) {
    throw new Error(`Invalid account type. Available types: ${ACCOUNT_TYPES.join(", ")}`);
  }
  

  if (monthlyIncome === undefined || monthlyIncome === null) {
    const error = new Error("Monthly income is required");
    error.statusCode = 400;
    throw error;
  }

  if (!validateSAIdNumber(citizenId)) {
    const error = new Error("Invalid South African ID number");
    error.statusCode = 400;
    throw error;
  }

  if (!validatePhoneNumber(phoneNumber)) {
    const error = new Error("Invalid South African phone number");
    error.statusCode = 400;
    throw error;
  }

  // --- Account type eligibility ---
  const accountConfig = ACCOUNT_TYPE_CONFIG[accountType];
  if (!accountConfig) {
    const error = new Error(
      `Invalid account type. Available types: ${Object.keys(ACCOUNT_TYPE_CONFIG).join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (Number(monthlyIncome) < accountConfig.minIncome) {
    const error = new Error(
      `A ${accountConfig.label} requires a minimum monthly income of R${accountConfig.minIncome.toLocaleString()}. Your income (R${Number(monthlyIncome).toLocaleString()}) does not qualify.`
    );
    error.statusCode = 400;
    throw error;
  }

  // --- Check for duplicate account type per user ---
  const existingAccount = await Account.findOne({ userId, accountType, status: "active" });
  if (existingAccount) {
    const error = new Error(
      `You already have an active ${accountConfig.label}. Only one account per type is allowed.`
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedPhone = normalizePhone(phoneNumber);
  const accountNumber = await Account.generateAccountNumber();

  const account = await Account.create({
    user: userId,
    citizenId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: normalizedPhone,
    accountNumber,
    accountType,
    monthlyIncome: Number(monthlyIncome),
    balance: 0,
    availableBalance: 0,
  });

  // Auto-create a virtual card for the account
  const cardNumber = await Card.generateCardNumber();
  const expiryDate = Card.generateExpiryDate();
  const cvv = Math.floor(100 + Math.random() * 900).toString();

  await Card.create({
    user: userId,
    account: account._id,
    cardholderName: `${firstName.trim()} ${lastName.trim()}`.toUpperCase(),
    cardNumber,
    expiryDate,
    cvvHash: cvv, // pre-save hook hashes this
  });

  // Log account opening activity
  await Activity.create({
    user: userId,
    account: account._id,
    activityType: "AccountOpened",
    description: `${accountConfig.label} opened`,
    amount: 0,
    balance: 0,
    netFlow: 0,
  });

  return account;
};

/**
 * Return all available account types and their requirements
 * Filtered by what the user's income qualifies for
 */
export const getAvailableAccountTypes = (monthlyIncome) => {
  return Object.entries(ACCOUNT_TYPE_CONFIG)
    .map(([key, config]) => ({
      type: key,
      label: config.label,
      description: config.description,
      features: config.features,
      minIncome: config.minIncome,
      eligible: Number(monthlyIncome) >= config.minIncome,
    }))
    .sort((a, b) => a.minIncome - b.minIncome);
};