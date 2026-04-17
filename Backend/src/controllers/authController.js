import { registerUser, loginUser } from "../services/authService.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};