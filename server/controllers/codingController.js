const CodingProblem =
  require("../models/codingProblem");

  const axios = require ('axios')
const CodeSubmission =
  require("../models/codeSubmission");
const {
  generateCodingProblem,
} = require("../services/codingAIService");
// generate 
const generateProblem = async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      language,
      company,
    } = req.body;

    const aiProblem =
      await generateCodingProblem(
        topic,
        difficulty,
        language,
        company
      );

    // Starter templates
    const starterTemplates = {
      javascript: `function solve() {

}`,
      java: `public class Main {

    public static void main(String[] args) {

    }

}`,
      python: `def solve():
    pass

solve()`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`,
      c: `#include <stdio.h>

int main() {

    return 0;
}`,
    };

    // Never expose the AI solution
    aiProblem.starterCode =
      starterTemplates[language] ||
      starterTemplates.javascript;

    const problem =
      await CodingProblem.create(aiProblem);

    res.status(201).json({
      success: true,
      problem,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
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


const pollSubmission = async (token, maxAttempts = 15, intervalMs = 300) => {
  const judge0Url = process.env.JUDGE0_API_URL || "http://localhost:2358";
  const url = `${judge0Url}/submissions/${token}?base64_encoded=false`;

  const headers = {};
  if (process.env.JUDGE0_API_KEY) {
    headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
    headers["X-Judge0-Token"] = process.env.JUDGE0_API_KEY;
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await axios.get(url, { headers });
    const data = response.data;

    // Status IDs: 1 (In Queue), 2 (Processing)
    if (data.status && (data.status.id === 1 || data.status.id === 2)) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      continue;
    }
    return data;
  }
  throw new Error("Submission evaluation timed out");
};
const runCode = async (req, res) => {
  try {
    const {
      problemId,
      code,
      language,
      input,
    } = req.body;

    const problem = await CodingProblem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const languageMap = {
      javascript: {
        language: "javascript",
        version: "18.15.0",
      },
      python: {
        language: "python",
        version: "3.10.0",
      },
      java: {
        language: "java",
        version: "15.0.2",
      },
      cpp: {
        language: "c++",
        version: "10.2.0",
      },
      c: {
        language: "c",
        version: "10.2.0",
      },
    };

    const lang = languageMap[language];

    if (!lang) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: lang.language,
        version: lang.version,
        files: [
          {
            name: "main",
            content: code,
          },
        ],
        stdin:
          input ||
          problem.examples?.[0]?.input ||
          "",
      }
    );

    const result = response.data.run;

    if (result.stderr) {
      return res.json({
        status: "Compilation Error",
        output: result.stderr,
        runtime: result.time + " s",
        memory: "--",
      });
    }

    const output = result.stdout.trim();

    let expectedOutput = "";
    let status = "Accepted";

    const usingCustomInput =
      input &&
      input !== problem.examples?.[0]?.input;

    if (!usingCustomInput) {
      expectedOutput =
        (problem.examples?.[0]?.output || "").trim();

      if (output !== expectedOutput) {
        status = "Wrong Answer";
      }
    }

    return res.json({
      status,
      output,
      expectedOutput,
      runtime: result.time + " s",
      memory: "--",
    });

  } catch (error) {
    console.error("Run Code Error:");

    console.error(error.response?.data || error.message);

    return res.status(500).json({
        message: "Code execution failed",
        error: error.response?.data || error.message
    });
}
};


module.exports = {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  runCode,
  deleteProblem,
  submitCode,
  getMySubmissions,
  generateProblem
};