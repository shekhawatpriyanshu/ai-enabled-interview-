const express = require("express");

const router = express.Router();

const {
  getProblems,
  getProblem,
  runCode,
  submitCode,
  getMySubmissions,
  getSubmissionById,
  generateProblem,
} = require("../controllers/codingController");

const {
  protect,
} = require("../middlewares/authMiddleware");

// Public
router.get("/", getProblems);
router.get("/:id", getProblem);

// User
router.post("/generate", protect, generateProblem);

router.post("/run", protect, runCode);

router.post("/submit/:id", protect, submitCode);

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