const express = require("express");

const {
  createContest,
  getContests,
  getContest,
  joinContest,
  submitContest,
  getLeaderboard,
  getMyContests,
} = require(
  "../controllers/contestController"
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
  createContest
);

router.get("/", getContests);

router.get("/:id", getContest);

router.post(
  "/join/:id",
  protect,
  joinContest
);

router.post(
  "/submit/:id",
  protect,
  submitContest
);

router.get(
  "/leaderboard/:id",
  getLeaderboard
);

router.get(
  "/my/contests",
  protect,
  getMyContests
);

module.exports = router;