const express = require("express");

const {
  createProblem,
  getProblems,
  runCode,
  getProblem,
  updateProblem,
  deleteProblem,
  submitCode,
  getMySubmissions,
  generateProblem
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
  "/generate",
  protect,
  generateProblem
);
router.post(
  "/problem/create",
  protect,
  createProblem
);
router.post("/run", protect, runCode);
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