const Test = require("../models/test");
const Submission = require("../models/submission");
const Question = require("../models/question");


// CREATE TEST
const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      duration,
      difficulty,
    } = req.body;

    const test = await Test.create({
      title,
      description,
      questions,
      duration,
      difficulty,
      totalMarks: questions.length,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL TESTS
const getTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate(
        "createdBy",
        "name email"
      );

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE TEST
const getTestById = async (
  req,
  res
) => {
  try {
    const test = await Test.findById(
      req.params.id
    ).populate("questions");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE TEST
const updateTest = async (
  req,
  res
) => {
  try {
    const test =
      await Test.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE TEST
const deleteTest = async (
  req,
  res
) => {
  try {
    await Test.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Test deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SUBMIT TEST
const submitTest = async (
  req,
  res
) => {
  try {
    const { testId, answers } =
      req.body;

    const test = await Test.findById(
      testId
    ).populate("questions");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    let correctAnswersCount = 0;
    const questionsList = test.questions || [];

    // Calculate score based on correctAnswer
    answers.forEach((ans) => {
      const questionDoc = questionsList.find(
        (q) => q._id.toString() === ans.question.toString()
      );
      if (questionDoc && questionDoc.correctAnswer === ans.answer) {
        correctAnswersCount++;
      }
    });

    const totalQuestions = questionsList.length;
    const score = correctAnswersCount;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const submission =
      await Submission.create({
        user: req.user._id,
        test: testId,
        answers,
        totalQuestions,
        score,
        percentage,
      });

    res.status(201).json({
      success: true,
      message:
        "Test submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET MY SUBMISSIONS
const getMySubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          user: req.user._id,
        })
          .populate("test")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        submissions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
  submitTest,
  getMySubmissions,
};