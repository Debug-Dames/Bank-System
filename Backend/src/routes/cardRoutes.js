import { Router } from "express";
import {
  getMyCards,
  getCardById,
  updateLimits,
  toggleCardStatus,
} from "../controllers/cardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// All card routes require authentication
router.use(authMiddleware);

// GET /api/cards
router.get("/", getMyCards);

// GET /api/cards/:id
router.get("/:id", getCardById);

// PATCH /api/cards/:id/limits
router.patch("/:id/limits", updateLimits);

// PATCH /api/cards/:id/:action  (action = 'block' | 'unblock')
router.patch("/:id/:action", toggleCardStatus);

export default router;