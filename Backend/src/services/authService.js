import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    balance: 0,
  });

  return {
    message: "User registered successfully",
    userId: user._id,
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
  };
};