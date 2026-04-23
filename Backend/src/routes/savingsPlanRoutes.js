import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  addToPlan,
  updatePlan,
  deletePlan,
  getInterest,
} from "../controllers/savingsPlanController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/savings-plans - Create a new savings plan
router.post("/", createPlan);

// GET /api/savings-plans - Get all savings plans for the user
router.get("/", getPlans);

// GET /api/savings-plans/:id - Get a specific savings plan
router.get("/:id", getPlanById);

// POST /api/savings-plans/:id/add - Add money to a savings plan
router.post("/:id/add", addToPlan);

// PUT /api/savings-plans/:id - Update a savings plan
router.put("/:id", updatePlan);

// DELETE /api/savings-plans/:id - Delete a savings plan
router.delete("/:id", deletePlan);

// GET /api/savings-plans/:id/interest - Calculate interest for a savings plan
router.get("/:id/interest", getInterest);

export default router;