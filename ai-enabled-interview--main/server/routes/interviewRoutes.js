const express = require("express");

const {
  startInterview,
  getInterview,
  submitInterview,
  getFeedback,
  getMyInterviews,
} = require(
  "../controllers/interviewController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const router = express.Router();

router.post(
  "/start",
  protect,
  startInterview
);

router.get(
  "/my-interviews",
  protect,
  getMyInterviews
);

router.get(
  "/:id",
  protect,
  getInterview
);

router.post(
  "/submit/:id",
  protect,
  submitInterview
);

router.get(
  "/feedback/:id",
  protect,
  getFeedback
);

module.exports = router;