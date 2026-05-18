import {
  createSavingsPlan,
  getUserSavingsPlans,
  getSavingsPlanById,
  addToSavingsPlan,
  updateSavingsPlan,
  deleteSavingsPlan,
  calculateInterest,
} from "../services/savingsPlanService.js";

/**
 * Create a new savings plan
 */
export const createPlan = async (req, res, next) => {
  try {
    const plan = await createSavingsPlan(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Savings plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Get all savings plans for the authenticated user
 */
export const getPlans = async (req, res, next) => {
  try {
    const plans = await getUserSavingsPlans(req.user._id);
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Get a specific savings plan by ID
 */
export const getPlanById = async (req, res, next) => {
  try {
    const plan = await getSavingsPlanById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Add money to a savings plan
 */
export const addToPlan = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const plan = await addToSavingsPlan(req.params.id, req.user._id, amount);
    res.status(200).json({
      success: true,
      message: "Amount added to savings plan successfully",
      data: plan,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Update a savings plan
 */
export const updatePlan = async (req, res, next) => {
  try {
    const plan = await updateSavingsPlan(req.params.id, req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Savings plan updated successfully",
      data: plan,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Delete a savings plan
 */
export const deletePlan = async (req, res, next) => {
  try {
    const result = await deleteSavingsPlan(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

/**
 * Calculate interest for a savings plan
 */
export const getInterest = async (req, res, next) => {
  try {
    const result = await calculateInterest(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};