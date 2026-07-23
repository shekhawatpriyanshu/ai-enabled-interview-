const Test = require("../../models/test");
const Submission = require("../../models/submission");
const Question = require("../../models/question");


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
module.exports={
    createTest,
    getTestById,
    getTests,
    deleteTest,
    updateTest
}