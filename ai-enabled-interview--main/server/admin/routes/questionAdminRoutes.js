const express = require("express");

const router = express.Router();

const {
  // Topic
  createTopic,
  getTopics,
  getTopicById,
  updateTopic,
  deleteTopic,

  // Company
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,

  // Question
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/adminQuestionsController");

const adminProtect = require("../middlewares/adminProtect");


// ==========================================
// Protect All Admin Routes
// ==========================================
router.use(adminProtect);


// ==========================================
// TOPIC ROUTES
// ==========================================

// Create Topic
router.post("/topics", createTopic);

// Get All Topics
router.get("/topics", getTopics);

// Get Topic By Id
router.get("/topics/:id", getTopicById);

// Update Topic
router.put("/topics/:id", updateTopic);

// Delete Topic
router.delete("/topics/:id", deleteTopic);



// ==========================================
// COMPANY ROUTES
// ==========================================

// Create Company
router.post("/companies", createCompany);

// Get All Companies
router.get("/companies", getCompanies);

// Get Company By Id
router.get("/companies/:id", getCompanyById);

// Update Company
router.put("/companies/:id", updateCompany);

// Delete Company
router.delete("/companies/:id", deleteCompany);



// ==========================================
// QUESTION ROUTES
// ==========================================

// Create Question
router.post("/", createQuestion);

// Get All Questions
router.get("/", getQuestions);

// Get Question By Id
router.get("/:id", getQuestionById);

// Update Question
router.put("/:id", updateQuestion);

// Delete Question
router.delete("/:id", deleteQuestion);


module.exports = router;