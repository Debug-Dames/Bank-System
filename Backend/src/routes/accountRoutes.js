import express from "express";
import {
  getBalance,
  deposit,
  withdraw,
} from "../controllers/accountController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/account/balance
router.get("/balance", authMiddleware, getBalance);

// POST /api/account/deposit
router.post("/deposit", authMiddleware, deposit);

// POST /api/account/withdraw
router.post("/withdraw", authMiddleware, withdraw);

export default router;