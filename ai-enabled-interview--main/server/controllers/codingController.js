// =============================================
// Get All Active Coding Problems
// =============================================
const axios = require("axios");
const { executeCode } = require("../services/judge0Services");
const CodingProblem = require("../models/codingProblem");
const CodeSubmission = require("../models/codeSubmission");
const { generateCodingProblem } = require("../services/codingAIService");
const User = require("../models/user");
const getProblems = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const difficulty = req.query.difficulty;
    const topic = req.query.topic;

    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).select("_id");
    const adminIds = admins ? admins.map(a => a._id) : [];

    const filter = {
      status: { $ne: false },
      $or: [
        { createdBy: { $in: adminIds } },
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    };

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topic) {
      filter.topic = topic;
    }

    const total =
      await CodingProblem.countDocuments(filter);

    const problems =
      await CodingProblem.find(filter)
        .select("-solution")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: problems.length,
      problems,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =============================================
// Get Single Problem
// =============================================

const getProblem = async (req, res) => {

  try {

    const problem =
      await CodingProblem.findOne({
        _id: req.params.id,
        status: { $ne: false },
      }).select("-solution");

    if (!problem) {

      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });

    }

    return res.status(200).json({
      success: true,
      problem,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// =============================================
// Get Submission Details
// =============================================

const getSubmissionById =
async (req, res) => {

  try {

    const submission =
      await CodeSubmission.findOne({

        _id: req.params.id,

        user: req.user._id,

      })
      .populate(
        "problem",
        "title difficulty topic"
      );

    if (!submission) {

      return res.status(404).json({

        success: false,

        message:
          "Submission not found",

      });

    }

    return res.status(200).json({

      success: true,

      submission,

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};
// =============================================
// Get My Submissions
// =============================================

const getMySubmissions =
async (req, res) => {

  try {

    const submissions =
      await CodeSubmission.find({

        user: req.user._id,

      })

      .populate(
        "problem",
        "title difficulty topic"
      )

      .sort({
        createdAt: -1,
      });

    return res.status(200).json({

      success: true,

      count:
        submissions.length,

      submissions,

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};
// ============================================
// Run Code
// ============================================

const runCode = async (req, res) => {
  try {
    const {
      problemId,
      code,
      language,
      input,
    } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const problem = await CodingProblem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    const result = await executeCode({
      code,
      language,
      input:
        input ||
        problem.examples?.[0]?.input ||
        "",
    });

    // Compilation Error
    if (
      result.statusId === 6 ||
      result.compileOutput
    ) {
      return res.json({
        success: false,
        status: "Compilation Error",
        output:
          result.compileOutput ||
          result.stderr,
        runtime: result.runtime,
        memory: result.memory,
      });
    }

    // Runtime Error
    if (
      result.stderr ||
      (result.statusId > 3 &&
        result.statusId !== 6)
    ) {
      return res.json({
        success: false,
        status:
          result.status ||
          "Runtime Error",
        output:
          result.stderr ||
          result.stdout,
        runtime: result.runtime,
        memory: result.memory,
      });
    }

    const output =
      result.stdout.trim();

    let expectedOutput = "";

    let status = "Accepted";

    const usingCustomInput =
      input &&
      input !==
        problem.examples?.[0]?.input;

    if (!usingCustomInput) {
      expectedOutput =
        (
          problem.examples?.[0]?.output ||
          ""
        ).trim();

      if (output !== expectedOutput) {
        status = "Wrong Answer";
      }
    }

    return res.json({
      success: true,
      status,
      output,
      expectedOutput,
      runtime: result.runtime,
      memory: result.memory,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =============================================
// Submit Code
// =============================================

const submitCode = async (req, res) => {
  try {

    const { code, language } = req.body;

    const problem = await CodingProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required.",
      });
    }

    const testCases = problem.examples || [];

    if (testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases available.",
      });
    }

    let passed = 0;
    let total = testCases.length;

    let finalStatus = "Accepted";

    let maxRuntime = "--";
    let maxMemory = "--";

    let compileOutput = "";
    let runtimeOutput = "";

    for (const testCase of testCases) {

      const result = await executeCode({
        code,
        language,
        input: testCase.input,
      });

      maxRuntime = result.runtime;
      maxMemory = result.memory;

      // Compilation Error
      if (
        result.statusId === 6 ||
        result.compileOutput
      ) {

        finalStatus = "Compilation Error";

        compileOutput =
          result.compileOutput ||
          result.stderr;

        break;
      }

      // Runtime Error
      if (
        result.stderr ||
        (result.statusId > 3 &&
          result.statusId !== 6)
      ) {

        finalStatus =
          result.status ||
          "Runtime Error";

        runtimeOutput =
          result.stderr ||
          result.stdout;

        break;
      }

      const actualOutput =
        result.stdout.trim();

      const expectedOutput =
        testCase.output.trim();

      if (
        actualOutput === expectedOutput
      ) {
        passed++;
      } else {
        finalStatus = "Wrong Answer";
      }
    }

    const score = Math.round(
      (passed / total) * 100
    );

    const submission =
      await CodeSubmission.create({

        user: req.user._id,

        problem: problem._id,

        code,

        language,

        status: finalStatus,

        score,

        runtime: maxRuntime,

        memory: maxMemory,

        passedTestCases: passed,

        totalTestCases: total,

      });

    return res.status(201).json({

      success: finalStatus === "Accepted",

      submission,

      result: {

        status: finalStatus,

        score,

        passedTestCases: passed,

        totalTestCases: total,

        runtime: maxRuntime,

        memory: maxMemory,

        compileOutput,

        runtimeOutput,

      },

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
// ==========================================
// Generate Coding Problem using AI (User)
// ==========================================
const generateProblem = async (req, res) => {
  try {
    const { topic, difficulty, language, company } = req.body;

    if (!topic || !difficulty || !language) {
      return res.status(400).json({
        success: false,
        message: "Topic, difficulty and language are required.",
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

    const aiProblem = await generateCodingProblem(
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
    aiProblem.createdBy = req.user._id;

    const problem = await CodingProblem.create(aiProblem);

    return res.status(201).json({
      success: true,
      message: "Coding problem generated successfully.",
      problem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {

  getProblems,

  getProblem,

  runCode,

  submitCode,

  getMySubmissions,

  getSubmissionById,

  generateProblem,

};