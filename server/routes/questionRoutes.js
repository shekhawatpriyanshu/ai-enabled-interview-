const express = require("express");

const {
  createTopic,
  getTopics,

  createCompany,
  getCompanies,

  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require(
  "../controllers/questionController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const router = express.Router();


// TOPICS
router.post(
  "/topic/create",
  protect,
  createTopic
);

router.get(
  "/topics",
  getTopics
);


// COMPANIES
router.post(
  "/company/create",
  protect,
  createCompany
);

router.get(
  "/companies",
  getCompanies
);


// QUESTIONS
router.post(
  "/create",
  protect,
  createQuestion
);

router.get(
  "/",
  getQuestions
);

router.get(
  "/:id",
  getQuestionById
);

router.put(
  "/update/:id",
  protect,
  updateQuestion
);

router.delete(
  "/delete/:id",
  protect,
  deleteQuestion
);

module.exports = router;