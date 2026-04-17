import express from "express";
import {
  getBalance,
  deposit,
  withdraw,
  getMyAccounts,
  openNewAccount,
  getUserAccountById,
  getAccountTypes,
} from "../controllers/accountController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/account/balance
router.get("/balance", authMiddleware, getBalance);

// POST /api/account/deposit
router.post("/deposit", authMiddleware, deposit);

// POST /api/account/withdraw
router.post("/withdraw", authMiddleware, withdraw);

// GET /api/accounts/types - List eligibility-based account types
router.get("/types", authMiddleware, getAccountTypes);

// GET /api/accounts - Get all accounts for the logged-in user
router.get("/", authMiddleware, getMyAccounts);

// POST /api/accounts - Open a new account
router.post("/", authMiddleware, openNewAccount);

// GET /api/accounts/:id - Get specific account details
router.get("/:id", authMiddleware, getUserAccountById);

export default router;