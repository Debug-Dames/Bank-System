import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateToken } from "../utils/helpers.js";
import {
  validateSAIdNumber,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  normalizePhone,
} from "../utils/validators.js";

/**
 * Register a new user who already has a bank account (linked by ID number)
 * Creates User record only — account opening is a separate flow
 */
export const registerUser = async (data) => {
  const { firstName, lastName, idNumber, email, password, confirmPassword, phoneNumber, pin } =
    data;
 
  // --- Validation ---
  if (!firstName || !lastName || !idNumber || !email || !password || !phoneNumber || !pin) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
 
  if (!validateSAIdNumber(idNumber)) {
    const error = new Error("Invalid South African ID number");
    error.statusCode = 400;
    throw error;
  }
 
  if (!validateEmail(email)) {
    const error = new Error("Invalid email address");
    error.statusCode = 400;
    throw error;
  }
 
  if (!validatePassword(password)) {
    const error = new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, and a number"
    );
    error.statusCode = 400;
    throw error;
  }
 
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.statusCode = 400;
    throw error;
  }
 
  if (!validatePhoneNumber(phoneNumber)) {
    const error = new Error("Invalid South African phone number");
    error.statusCode = 400;
    throw error;
  }
 
  const normalizedPhone = normalizePhone(phoneNumber);
 
  // --- Check uniqueness ---
  const [existingEmail, existingId] = await Promise.all([
    User.findOne({ email: email.toLowerCase() }),
    User.findOne({ idNumber }),
  ]);
 
  if (existingEmail) {
    const error = new Error("Email address is already registered");
    error.statusCode = 400;
    throw error;
  }
 
  if (existingId) {
    const error = new Error("ID number is already registered");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPin = await bcrypt.hash(pin.toString(), salt);
 
  // --- Create user ---
  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    idNumber,
    email: email.toLowerCase().trim(),
    passwordHash: password, // pre-save hook will hash this
    phoneNumber: normalizedPhone,
    pinHash: hashedPin,
    role: "customer",
    status: "active",
  });
 
  const token = generateToken(user._id);
 
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      idNumber: user.idNumber,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
    },
    token,
  };
};


/**
 * Login with ID number and password
 */
export const loginUser = async ({ idNumber, password }) => {
  if (!idNumber || !password) {
    const error = new Error("ID number and password are required");
    error.statusCode = 400;
    throw error;
  }
 
  const user = await User.findOne({ idNumber });
 
  if (!user) {
    const error = new Error("Invalid ID number or password");
    error.statusCode = 401;
    throw error;
  }
 
  if (user.status !== "active") {
    const error = new Error("Your account has been suspended. Please contact support.");
    error.statusCode = 403;
    throw error;
  }
 
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error("Invalid ID number or password");
    error.statusCode = 401;
    throw error;
  }
 
  // Update last login
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
 
  const token = generateToken(user._id);
 
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      idNumber: user.idNumber,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    },
    token,
  };
};
 
/**
 * Get user profile with their accounts
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash -pinHash");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};