import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deposit,
  withdraw,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);

export default router;