const express = require("express");

const {
  getAllInterviews,
  getInterviewById,
  deleteInterview,
  updateInterviewStatus,
  getInterviewStats,
} = require("../controllers/interviewController");

const adminProtect = require("../middlewares/adminProtect");

const router = express.Router();

/**
 * Dashboard Statistics
 * GET /api/admin/interviews/stats
 */
router.get(
  "/stats",
  adminProtect,
  getInterviewStats
);

/**
 * Get All Interviews
 * GET /api/admin/interviews
 */
router.get(
  "/",
  adminProtect,
  getAllInterviews
);

/**
 * Get Interview Details
 * GET /api/admin/interviews/:id
 */
router.get(
  "/:id",
  adminProtect,
  getInterviewById
);

/**
 * Update Interview Status
 * PUT /api/admin/interviews/:id/status
 */
router.put(
  "/:id/status",
  adminProtect,
  updateInterviewStatus
);

/**
 * Delete Interview
 * DELETE /api/admin/interviews/:id
 */
router.delete(
  "/:id",
  adminProtect,
  deleteInterview
);

module.exports = router;