const express = require("express");

const router = express.Router();

const {
  generateProblem,
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  changeProblemStatus,
  getDashboardStats,
  getRecentProblems,
  getRecentSubmissions,
  getProblemAnalytics,
} = require("../controllers/codingAdminController");

const adminProtect = require("../middlewares/adminProtect");

// Protect all admin routes
router.use(adminProtect);

// ===============================
// Dashboard
// ===============================

router.get(
  "/dashboard/stats",
  getDashboardStats
);

router.get(
  "/dashboard/analytics",
  getProblemAnalytics
);

router.get(
  "/dashboard/recent-problems",
  getRecentProblems
);

router.get(
  "/dashboard/recent-submissions",
  getRecentSubmissions
);

// ===============================
// AI Generate
// ===============================

router.post(
  "/generate",
  generateProblem
);

// ===============================
// CRUD
// ===============================

router.post(
  "/",
  createProblem
);

router.get(
  "/",
  getAllProblems
);

router.get(
  "/:id",
  getProblemById
);

router.put(
  "/:id",
  updateProblem
);

router.patch(
  "/:id/status",
  changeProblemStatus
);

router.delete(
  "/:id",
  deleteProblem
);

module.exports = router;