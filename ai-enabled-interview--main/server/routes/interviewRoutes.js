const express = require("express");

const {
  startInterview,
  getInterview,
  submitInterview,
  submitCodingRound,
  runInterviewCode,
  submitVoiceRound,
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

router.post(
  "/submit-coding/:id",
  protect,
  submitCodingRound
);

router.post(
  "/run-code",
  protect,
  runInterviewCode
);

router.post(
  "/submit-voice/:id",
  protect,
  submitVoiceRound
);

router.get(
  "/feedback/:id",
  protect,
  getFeedback
);

module.exports = router;