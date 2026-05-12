import { registerUser, loginUser, getUserProfile } from "../services/authService.js";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// GET PROFILE
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
