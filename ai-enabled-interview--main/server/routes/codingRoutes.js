const express = require("express");

const router = express.Router();

const {
  getProblems,
  getProblem,
  getProblemById,
  submitCode,
  getMySubmissions,
  getSubmissionById,
  generateProblem,
} = require("../controllers/codingController");

const { runCode } = require("../controllers/runController");

const {
  protect,
} = require("../middlewares/authMiddleware");

// Public
router.get("/", getProblems);
router.get("/problems", getProblems);
router.get("/:id", getProblem);
router.get("/problems/:id", getProblemById);

// User
router.post("/generate", protect, generateProblem);

router.post("/run", protect, runCode);

router.post("/submit", protect, submitCode);

router.get(
  "/submissions/my",
  protect,
  getMySubmissions
);

router.get(
  "/submission/:id",
  protect,
  getSubmissionById
);

module.exports = router;