const CodingProblem =
  require("../models/codingProblem");

const CodeSubmission =
  require("../models/codeSubmission");


// CREATE PROBLEM
const createProblem =
  async (req, res) => {
    try {
      const problem =
        await CodingProblem.create(
          req.body
        );

      res.status(201).json({
        success: true,
        problem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// GET ALL PROBLEMS
const getProblems =
  async (req, res) => {
    try {
      const problems =
        await CodingProblem.find();

      res.status(200).json({
        success: true,
        count:
          problems.length,
        problems,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// GET SINGLE PROBLEM
const getProblem =
  async (req, res) => {
    try {
      const problem =
        await CodingProblem.findById(
          req.params.id
        );

      if (!problem) {
        return res.status(404).json({
          success: false,
          message:
            "Problem not found",
        });
      }

      res.status(200).json({
        success: true,
        problem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// UPDATE PROBLEM
const updateProblem =
  async (req, res) => {
    try {
      const problem =
        await CodingProblem.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        problem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// DELETE PROBLEM
const deleteProblem =
  async (req, res) => {
    try {
      await CodingProblem.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Problem deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// SUBMIT CODE
const submitCode =
  async (req, res) => {
    try {
      const {
        code,
        language,
      } = req.body;

      const problem =
        await CodingProblem.findById(
          req.params.id
        );

      if (!problem) {
        return res.status(404).json({
          success: false,
          message:
            "Problem not found",
        });
      }

      const submission =
        await CodeSubmission.create(
          {
            user:
              req.user._id,

            problem:
              problem._id,

            code,

            language,

            status:
              "Accepted",

            score: 100,
          }
        );

      res.status(201).json({
        success: true,
        submission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// GET MY SUBMISSIONS
const getMySubmissions =
  async (req, res) => {
    try {
      const submissions =
        await CodeSubmission.find({
          user:
            req.user._id,
        })
          .populate(
            "problem",
            "title difficulty"
          )
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
        message:
          error.message,
      });
    }
  };

module.exports = {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  submitCode,
  getMySubmissions,
};