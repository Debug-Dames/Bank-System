import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, idNumber, phoneNumber, pin } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password and pin
    const passwordHash = await bcrypt.hash(password, 10);
    const pinHash = await bcrypt.hash(pin || "1234", 10);

    const user = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      pinHash,
      idNumber,
      phoneNumber,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};