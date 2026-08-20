// =============================================
// Get All Active Coding Problems
// =============================================
const { executeCode } = require("../services/judge0Services");
const {
  createSubmission,
  waitForResult
} = require("../services/judge0Service");
const {
  processJudgeResult
} = require("../utils/judgeResultHandler");
const CodingProblem = require("../models/codingProblem");
const Submission = require("../models/codeSubmission");
const { generateCodingProblem } = require("../services/codingAIService");
const User = require("../models/user");
const {
  generateWrapper
} = require("../services/wrapperService");

//----------------------------------------------------
// Judge0 Configuration
//----------------------------------------------------

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

//----------------------------------------------------
// Language Mapping
//----------------------------------------------------

const languageMap = {
  javascript: 102,
  python: 100,
  java: 91,
  cpp: 105,
  c: 103
};

//----------------------------------------------------
// Wrapper Dispatcher
//----------------------------------------------------


const getProblems = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const difficulty = req.query.difficulty;
    const topic = req.query.topic;

    const Admin = require("../models/admin");
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).select("_id");
    const adminDocs = await Admin.find().select("_id");

    const adminIds = [
      ...(admins ? admins.map(a => a._id) : []),
      ...(adminDocs ? adminDocs.map(a => a._id) : [])
    ];

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

const getProblemById = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
    res.status(200).json({ success: true, problem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

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
        await Submission.findOne({

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
        await Submission.find({

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
    const {
      problemId,
      language,
      code
    } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const problem = await CodingProblem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    let normLang = (language || "javascript").toLowerCase();
    if (normLang === "js") normLang = "javascript";
    if (normLang === "py" || normLang === "python3") normLang = "python";
    if (normLang === "c++") normLang = "cpp";

    const wrappedCode = generateWrapper(
      normLang,
      code,
      problem
    );

    const testResults = [];

    // Use testCases if available, fall back to examples
    const cases = (problem.testCases && problem.testCases.length > 0)
      ? problem.testCases
      : (problem.examples || []);

    const visibleCases = cases.filter(tc => !tc.isHidden);
    const hiddenCases = cases.filter(tc => tc.isHidden);
    const allCases = [...visibleCases, ...hiddenCases];

    const normalizeOutput = (str) => {
      return String(str || "").trim()
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, '')        // remove all whitespace
        .replace(/'/g, '"');        // Python uses single quotes
    };

    let allPassed = true;
    let finalStatus = "Accepted";

    for (const testCase of allCases) {
      let stdinStr = "";
      const inp = testCase.input;
      if (typeof inp === "object" && inp !== null && !Array.isArray(inp)) {
        stdinStr = Object.values(inp).map(v =>
          typeof v === "object" ? JSON.stringify(v) : String(v)
        ).join("\n");
      } else if (Array.isArray(inp)) {
        stdinStr = JSON.stringify(inp);
      } else {
        stdinStr = String(inp);
      }

      let execResult;
      try {
        execResult = await executeCode({
          code: wrappedCode,
          language: normLang,
          input: stdinStr,
        });
      } catch (judgeErr) {
        console.error("Judge0 Execution error:", judgeErr.message);
        execResult = {
          statusId: 6,
          status: "Execution Error",
          stdout: "",
          stderr: judgeErr.message,
          compileOutput: judgeErr.message,
          runtime: "--",
          memory: "--"
        };
      }

      const actualRaw = (execResult.stdout || "").trim();
      const actualNorm = normalizeOutput(actualRaw);

      const expectedRaw = (typeof testCase.output === "object" && testCase.output !== null)
        ? JSON.stringify(testCase.output)
        : String(testCase.output || "");
      const expectedNorm = normalizeOutput(expectedRaw);

      let caseStatus = "SUCCESS";
      let caseMessage = "";

      if (execResult.statusId === 6 || execResult.compileOutput) {
        caseStatus = "COMPILATION_ERROR";
        caseMessage = execResult.compileOutput || execResult.stderr || "Compilation failed";
        allPassed = false;
        finalStatus = "COMPILATION_ERROR";
      } else if (execResult.stderr || (execResult.statusId > 3 && execResult.statusId !== 6)) {
        caseStatus = "RUNTIME_ERROR";
        caseMessage = execResult.stderr || execResult.stdout || "Runtime Exception";
        allPassed = false;
        finalStatus = "RUNTIME_ERROR";
      } else if (actualNorm !== expectedNorm) {
        caseStatus = "WRONG_ANSWER";
        caseMessage = `Expected: ${expectedRaw}\nGot: ${actualRaw}`;
        allPassed = false;
        if (finalStatus === "Accepted") finalStatus = "Wrong Answer";
      }

      testResults.push({
        input: testCase.input,
        expected: testCase.output,
        actual: actualRaw,
        status: caseStatus,
        message: caseMessage,
        time: parseFloat(execResult.runtime) || 0,
        memory: parseFloat(execResult.memory) || 0
      });

      if (!allPassed && (caseStatus === "COMPILATION_ERROR" || caseStatus === "RUNTIME_ERROR")) {
        break;
      }
    }

    if (allPassed) {
      finalStatus = "Accepted";
    }

    const testCasesPassed = testResults.filter(t => t.status === "SUCCESS").length;

    let submission = null;
    try {
      submission = await Submission.create({
        user: req.user._id,
        problem: problemId,
        language: normLang,
        sourceCode: code,
        status: finalStatus,
        testCasesPassed,
        totalTestCases: allCases.length,
        executionTime: Math.round(testResults.reduce((acc, t) => acc + (t.time || 0), 0) * 1000),
        memoryUsed: Math.round(testResults.reduce((acc, t) => acc + (t.memory || 0), 0))
      });
    } catch (dbErr) {
      console.warn("DB submission save warning:", dbErr.message);
    }

    return res.json({
      success: true,
      status: finalStatus,
      passed: allPassed,
      testCases: testResults.map((test, index) => {
        return {
          status: test.status,
          actual: allCases[index]?.isHidden ? null : test.actual,
          expected: allCases[index]?.isHidden ? null : test.expected
        };
      }),
      submission,
      runtime: submission ? `${submission.executionTime} ms` : "--",
      memory: submission ? `${submission.memoryUsed} KB` : "--"
    });

  } catch (error) {
    console.error("Submit Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Execution failed"
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
      java: `class Solution {\n    public int solve() {\n        return 0;\n    }\n}`,
      python: `def solve():\n    pass\n`,
      cpp: `class Solution {\npublic:\n    int solve() {\n        return 0;\n    }\n};`,
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

  getProblemById,

  runCode,

  submitCode,

  getMySubmissions,

  getSubmissionById,

  generateProblem,

};