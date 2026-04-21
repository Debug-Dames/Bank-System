import express from "express";
import { authMiddleware }from "../middleware/authMiddleware.js";
import {
  deposit,
  withdraw,
  sendCash,
  getTransactionHistory,
  purchaseAirtime,
  purchaseElectricity
} from "../controllers/transactionController.js";

const router = express.Router();


// POST /api/transactions/:accountId/deposit
router.post("/:accountId/deposit", authMiddleware, deposit);
 
// POST /api/transactions/:accountId/withdraw
router.post("/:accountId/withdraw", authMiddleware, withdraw);

// POST /api/transactions/:accountId/send-cash
router.post("/:accountId/send-cash", authMiddleware, sendCash);
 
// GET /api/transactions/history/:accountId
router.get("/history/:accountId", authMiddleware, getTransactionHistory);
 
// POST /api/transactions/:accountId/utility/airtime
router.post("/:accountId/utility/airtime", authMiddleware, purchaseAirtime);
 
// POST /api/transactions/:accountId/utility/electricity
router.post("/:accountId/utility/electricity", authMiddleware, purchaseElectricity);

export default router;