const express = require("express");

const router = express.Router();

const {
  createAnalytics,
  getMyAnalytics,
  updateAnalytics,
  getMyRewards,
  getBadges,
  getAchievements,
} = require("../controllers/analyticsController");

const {
  protect,
} = require("../middlewares/authMiddleware");

// Analytics

router.post(
  "/create",
  protect,
  createAnalytics
);

router.get(
  "/me",
  protect,
  getMyAnalytics
);

router.put(
  "/update",
  protect,
  updateAnalytics
);

// Rewards

router.get(
  "/rewards",
  protect,
  getMyRewards
);

// Badges

router.get(
  "/badges",
  protect,
  getBadges
);

// Achievements

router.get(
  "/achievements",
  protect,
  getAchievements
);

module.exports = router;