const express = require("express");

const router = express.Router();

const {
  getRewardDashboard,
  getAllRewards,
  getRewardById,
  deleteReward,
  giveReward,
} = require("../controllers/adminRewardController");


const adminProtect = require("../middlewares/adminProtect");



// ========================================
// Reward Dashboard
// ========================================

router.get(
  "/dashboard",
  adminProtect,
  getRewardDashboard
);



// ========================================
// Get All Rewards
// ========================================

router.get(
  "/",
  adminProtect,
  getAllRewards
);



// ========================================
// Give Manual Reward
// ========================================

router.post(
  "/give",
  adminProtect,
  giveReward
);



// ========================================
// Get Reward Details
// ========================================

router.get(
  "/:id",
  adminProtect,
  getRewardById
);



// ========================================
// Delete Reward
// ========================================

router.delete(
  "/:id",
  adminProtect,
  deleteReward
);



module.exports = router;