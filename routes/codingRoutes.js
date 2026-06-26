const express = require("express");

const {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  submitCode,
  getMySubmissions,
} = require(
  "../controllers/codingController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const router =
  express.Router();

router.post(
  "/problem/create",
  protect,
  createProblem
);

router.get(
  "/problem/all",
  getProblems
);

router.get(
  "/problem/:id",
  getProblem
);

router.put(
  "/problem/:id",
  protect,
  updateProblem
);

router.delete(
  "/problem/:id",
  protect,
  deleteProblem
);

router.post(
  "/submit/:id",
  protect,
  submitCode
);

router.get(
  "/submissions/my",
  protect,
  getMySubmissions
);

module.exports = router;