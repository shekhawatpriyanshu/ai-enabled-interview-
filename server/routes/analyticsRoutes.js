const express = require("express");

const {
  createAnalytics,
  getMyAnalytics,
  updateAnalytics,
  createBadge,
  createAchievement,
  assignReward,
  getMyRewards,
} = require(
  "../controllers/analyticsController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const router =
  express.Router();

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

router.post(
  "/badge/create",
  protect,
  createBadge
);

router.post(
  "/achievement/create",
  protect,
  createAchievement
);

router.post(
  "/reward/assign",
  protect,
  assignReward
);

router.get(
  "/rewards",
  protect,
  getMyRewards
);

module.exports = router;