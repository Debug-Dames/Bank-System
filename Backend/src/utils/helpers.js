import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Ensure variables are loaded if this file is called independently
dotenv.config();

/**
 * Generate a signed JWT for a user
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Format currency amount to ZAR string
 */
export const formatCurrency = (amount, currency = "ZAR") => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Generate a transaction reference string
 */
export const generateReference = (prefix = "TXN") => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}${timestamp}${random}`;
};

/**
 * Mask an account number - show only last 4 digits
 * e.g. 1234567890 → ******7890
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return "";
  return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};

/**
 * Mask a card number - show only last 4 digits in groups
 * e.g. 1234567812345678 → **** **** **** 5678
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return "";
  const last4 = cardNumber.slice(-4);
  return `**** **** **** ${last4}`;
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

/**
 * Paginate a mongoose query result
 */
export const paginate = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};