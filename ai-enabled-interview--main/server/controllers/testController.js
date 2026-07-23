const Test = require("../models/test");
const Submission = require("../models/submission");
const Question = require("../models/question");





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
   getTests,
  getTestById,
  
  submitTest,
  getMySubmissions,
};