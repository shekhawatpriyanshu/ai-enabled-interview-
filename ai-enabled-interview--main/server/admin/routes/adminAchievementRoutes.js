const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAchievements,
  getAchievementStatistics,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementStatus,
  getBadges,
} = require("../controllers/adminAchievementController");

const adminProtect = require("../middlewares/adminProtect");

// Dashboard
router.get(
  "/dashboard",
  adminProtect,
  getDashboard
);

// Achievement CRUD
router.get(
  "/",
  adminProtect,
  getAchievements
);
// Badges list
router.get(
  "/badges",
  adminProtect,
  getBadges
);

router.get(
  "/statistics",
  adminProtect,
  getAchievementStatistics
);

router.get(
  "/:id",
  adminProtect,
  getAchievementById
);

router.post(
  "/",
  adminProtect,
  createAchievement
);

router.put(
  "/:id",
  adminProtect,
  updateAchievement
);

router.delete(
  "/:id",
  adminProtect,
  deleteAchievement
);

router.patch(
  "/:id/status",
  adminProtect,
  toggleAchievementStatus
);

module.exports = router;