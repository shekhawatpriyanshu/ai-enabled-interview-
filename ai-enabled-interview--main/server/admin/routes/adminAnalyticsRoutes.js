const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getUserAnalytics,
  getInterviewAnalytics,
  getCodingAnalytics,
  getResumeAnalytics,
  
} = require("../controllers/adminAnalyticsController");

const adminProtect = require("../middlewares/adminProtect");

router.get(
  "/dashboard",
  adminProtect,
  getDashboard
);

router.get(
  "/users",
  adminProtect,
  getUserAnalytics
);
router.get(
  "/interviews",
  adminProtect,
  getInterviewAnalytics
);

router.get(
  "/coding",
  adminProtect,
  getCodingAnalytics
);

router.get(
  "/resume",
  adminProtect,
  getResumeAnalytics
);

module.exports = router;