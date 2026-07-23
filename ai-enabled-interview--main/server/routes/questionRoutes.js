const express = require("express");

const router = express.Router();

const {
  getQuestions,
  getQuestionById,
  getTopics,
  getCompanies,
} = require("../controllers/questionController");

const { protect } = require("../middlewares/authMiddleware");

// If your platform requires login to access the question bank,
// uncomment the next line.
// router.use(protect);

// Question Routes
router.get("/topics", getTopics);
router.get("/companies", getCompanies);

router.get("/", getQuestions);
router.get("/:id", getQuestionById);

module.exports = router;