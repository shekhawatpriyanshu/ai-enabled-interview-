const Question = require("../models/question");
const Topic = require("../models/topic");
const Company = require("../models/company");


// CREATE TOPIC
const createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(
      req.body
    );

    res.status(201).json({
      success: true,
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET TOPICS
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE COMPANY
const createCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.create(req.body);

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET COMPANIES
const getCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find();

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE QUESTION
const createQuestion = async (
  req,
  res
) => {
  try {
    const {
      title,
      answer,
      difficulty,
      topic,
      company,
      tags,
    } = req.body;

    const topicExists =
      await Topic.findById(topic);

    const companyExists =
      await Company.findById(company);

    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const question =
      await Question.create({
        title,
        answer,
        difficulty,
        topic,
        company,
        tags,
        createdBy: req.user._id,
      });

    res.status(201).json({
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


// GET ALL QUESTIONS
const getQuestions = async (
  req,
  res
) => {
  try {
    const questions =
      await Question.find()
        .populate("topic")
        .populate("company")
        .populate(
          "createdBy",
          "name email"
        );

    res.status(200).json({
      success: true,
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


// GET QUESTION BY ID
const getQuestionById = async (
  req,
  res
) => {
  try {
    const question =
      await Question.findById(
        req.params.id
      )
        .populate("topic")
        .populate("company");

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
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


// UPDATE QUESTION
const updateQuestion = async (
  req,
  res
) => {
  try {
    const question =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
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


// DELETE QUESTION
const deleteQuestion = async (
  req,
  res
) => {
  try {
    const question =
      await Question.findByIdAndDelete(
        req.params.id
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createTopic,
  getTopics,

  createCompany,
  getCompanies,

  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};