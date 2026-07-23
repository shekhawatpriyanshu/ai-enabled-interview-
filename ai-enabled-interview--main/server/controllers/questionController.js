const Question = require("../models/question");
const Topic = require("../models/topic");
const Company = require("../models/company");

const viewedQuestions = new Map();

// Periodically clean up entries older than 30 seconds to prevent memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of viewedQuestions.entries()) {
    if (now - timestamp > 30000) {
      viewedQuestions.delete(key);
    }
  }
}, 60000);


// =========================================
// GET ALL QUESTIONS
// =========================================
const getQuestions = async (req, res) => {
  try {
    const {
      search,
      topic,
      company,
      difficulty,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (topic) {
      filter.topic = topic;
    }

    if (company) {
      filter.company = company;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const total = await Question.countDocuments(filter);

    const questions = await Question.find(filter)
      .populate("topic", "name")
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalQuestions: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// GET QUESTION DETAILS
// =========================================
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("topic", "name")
      .populate("company", "name logo")
      .populate("createdBy", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Only increment views if not viewed from this IP in the last 10 seconds (prevents StrictMode double increment)
    const viewKey = `${req.ip}-${req.params.id}`;
    const now = Date.now();
    const lastViewed = viewedQuestions.get(viewKey);

    if (!lastViewed || now - lastViewed > 10000) {
      question.views += 1;
      await question.save();
      viewedQuestions.set(viewKey, now);
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// GET ALL TOPICS
// =========================================
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// GET ALL COMPANIES
// =========================================
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// EXPORTS
// =========================================
module.exports = {
  getQuestions,
  getQuestionById,
  getTopics,
  getCompanies,
};