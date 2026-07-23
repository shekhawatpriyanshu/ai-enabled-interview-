 const CodingProblem = require("../../models/codingProblem");
const CodeSubmission = require("../../models/codeSubmission");
const { generateCodingProblem } = require("../../services/codingAIService");


// ==========================================
// Generate Coding Problem using AI
// ==========================================

const generateProblem = async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      language,
      company,
    } = req.body;

    if (!topic || !difficulty || !language) {
      return res.status(400).json({
        success: false,
        message:
          "Topic, difficulty and language are required.",
      });
    }

    // Parse language input into a normalized array of supported languages
    let languagesArray = [];
    if (typeof language === "string") {
      languagesArray = language
        .split(/[,\s/]+/)
        .map(lang => lang.trim().toLowerCase())
        .map(lang => {
          if (lang === "js") return "javascript";
          if (lang === "py" || lang === "py3") return "python";
          if (lang === "c++") return "cpp";
          return lang;
        })
        .filter(lang => ["javascript", "java", "python", "cpp", "c"].includes(lang));
    }

    if (languagesArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid supported language is required (javascript, java, python, cpp, c).",
      });
    }

    const aiProblem =
      await generateCodingProblem(
        topic,
        difficulty,
        languagesArray[0], // Use first language for solution & prompt generation
        company
      );

    const starterTemplates = {
      javascript: `function solve() {\n\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n\n    }\n}`,
      python: `def solve():\n    pass\n\nsolve()`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    return 0;\n}`,
      c: `#include<stdio.h>\n\nint main(){\n    return 0;\n}`,
    };

    aiProblem.starterCode = {
      javascript: languagesArray.includes("javascript") ? starterTemplates.javascript : "",
      java: languagesArray.includes("java") ? starterTemplates.java : "",
      python: languagesArray.includes("python") ? starterTemplates.python : "",
      cpp: languagesArray.includes("cpp") ? starterTemplates.cpp : "",
      c: languagesArray.includes("c") ? starterTemplates.c : "",
    };

    aiProblem.supportedLanguages = languagesArray;

    aiProblem.createdBy =
      req.user._id;

    const problem =
      await CodingProblem.create(
        aiProblem
      );

    return res.status(201).json({
      success: true,
      message:
        "Coding problem generated successfully.",
      problem,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// Create Coding Problem
// ==========================================

const createProblem =
  async (req, res) => {
    try {
      const {
        title,
        description,
        difficulty,
        topic,
        tags,
        constraints,
        examples,
        starterCode,
        solution,
        supportedLanguages,
        timeLimit,
        memoryLimit,
      } = req.body;

      const alreadyExists =
        await CodingProblem.findOne({
          title,
        });

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message:
            "Problem already exists.",
        });
      }

      const problem =
        await CodingProblem.create({
          title,
          description,
          difficulty,
          topic,
          tags,
          constraints,
          examples,
          starterCode,
          solution,
          supportedLanguages,
          timeLimit,
          memoryLimit,
          createdBy:
            req.user._id,
        });

      return res.status(201).json({
        success: true,
        message:
          "Problem created successfully.",
        problem,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



// ==========================================
// Get All Problems
// ==========================================

const getAllProblems =
  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) ||
        10;

      const skip =
        (page - 1) * limit;

      const search =
        req.query.search || "";

      const difficulty =
        req.query.difficulty;

      const topic =
        req.query.topic;

      const status =
        req.query.status;

      const filter = {};

      if (search) {
        filter.title = {
          $regex: search,
          $options: "i",
        };
      }

      if (difficulty) {
        filter.difficulty =
          difficulty;
      }

      if (topic) {
        filter.topic = topic;
      }

      if (
        status === "true" ||
        status === "false"
      ) {
        filter.status =
          status === "true";
      }

      const total =
        await CodingProblem.countDocuments(
          filter
        );

      const problems =
        await CodingProblem.find(
          filter
        )
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);

      return res.status(200).json({
        success: true,

        total,

        page,

        pages: Math.ceil(
          total / limit
        ),

        count:
          problems.length,

        problems,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  // ==========================================
// Get Single Problem
// ==========================================

const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await CodingProblem.findById(id)
      .populate("createdBy", "name email");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found.",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Update Problem
// ==========================================

const updateProblem = async (req, res) => {

  try {

    const { id } = req.params;

    const problem =
      await CodingProblem.findById(id);

    if (!problem) {

      return res.status(404).json({
        success: false,
        message: "Coding problem not found.",
      });

    }

    Object.assign(problem, req.body);

    await problem.save();

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully.",
      problem,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ==========================================
// Delete Problem
// ==========================================

const deleteProblem = async (req, res) => {

  try {

    const { id } = req.params;

    const problem =
      await CodingProblem.findById(id);

    if (!problem) {

      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });

    }

    problem.isDeleted = true;
    problem.deletedAt = new Date();
    await problem.save();

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ==========================================
// Change Status
// ==========================================

const changeProblemStatus =
  async (req, res) => {

    try {

      const { id } = req.params;

      const problem =
        await CodingProblem.findById(id);

      if (!problem) {

        return res.status(404).json({
          success: false,
          message: "Problem not found.",
        });

      }

      problem.status = !problem.status;

      await problem.save();

      return res.status(200).json({
        success: true,
        message:
          `Problem ${
            problem.status
              ? "Activated"
              : "Deactivated"
          } Successfully.`,
        problem,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };
  // ==========================================
// Dashboard Stats
// ==========================================

const getDashboardStats = async (req, res) => {
  try {

    const totalProblems =
      await CodingProblem.countDocuments();

    const activeProblems =
      await CodingProblem.countDocuments({
        status: true,
      });

    const inactiveProblems =
      await CodingProblem.countDocuments({
        status: false,
      });

    const easyProblems =
      await CodingProblem.countDocuments({
        difficulty: "Easy",
      });

    const mediumProblems =
      await CodingProblem.countDocuments({
        difficulty: "Medium",
      });

    const hardProblems =
      await CodingProblem.countDocuments({
        difficulty: "Hard",
      });

    const totalSubmissions =
      await CodeSubmission.countDocuments();

    const acceptedSubmissions =
      await CodeSubmission.countDocuments({
        status: "Accepted",
      });

    const acceptanceRate =
      totalSubmissions > 0
        ? (
            (acceptedSubmissions /
              totalSubmissions) *
            100
          ).toFixed(2)
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalProblems,

        activeProblems,

        inactiveProblems,

        easyProblems,

        mediumProblems,

        hardProblems,

        totalSubmissions,

        acceptedSubmissions,

        acceptanceRate,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Recent Problems
// ==========================================

const getRecentProblems =
  async (req, res) => {

    try {

      const problems =
        await CodingProblem.find()
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res.status(200).json({
        success: true,
        problems,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };
  // ==========================================
// Problem Analytics
// ==========================================

const getProblemAnalytics =
  async (req, res) => {

    try {

      const difficultyStats =
        await CodingProblem.aggregate([
          {
            $group: {
              _id: "$difficulty",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      const topicStats =
        await CodingProblem.aggregate([
          {
            $group: {
              _id: "$topic",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
        ]);

      const monthlyProblems =
        await CodingProblem.aggregate([
          {
            $group: {
              _id: {
                month: {
                  $month:
                    "$createdAt",
                },
                year: {
                  $year:
                    "$createdAt",
                },
              },

              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

      return res.status(200).json({
        success: true,

        analytics: {
          difficultyStats,
          topicStats,
          monthlyProblems,
        },
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };
  // ==========================================
// Recent Submissions
// ==========================================

const getRecentSubmissions =
  async (req, res) => {

    try {

      const submissions =
        await CodeSubmission.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "problem",
            "title difficulty"
          )
          .sort({
            createdAt: -1,
          })
          .limit(20);

      return res.status(200).json({
        success: true,
        submissions,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

module.exports = {

  generateProblem,

  createProblem,

  getAllProblems,

  getProblemById,

  updateProblem,

  deleteProblem,

  changeProblemStatus,

  getDashboardStats,

  getRecentProblems,

  getProblemAnalytics,

  getRecentSubmissions,

};