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

      const languageMap = {
        javascript: 102, // Node.js 22.08.0
        python: 100,     // Python 3.12.5
        java: 91,        // Java JDK 17.0.6
        cpp: 105,        // C++ GCC 14.1.0
        c: 103,          // C GCC 14.1.0
      };

      const langId = languageMap[language];

      if (!langId) {
        return res.status(400).json({
          success: false,
          message: "Unsupported language",
        });
      }

      const examples = problem.examples || [];
      const testCases = examples.length > 0 ? examples : [{ input: "", output: "" }];

      let maxTime = 0;
      let maxMemory = 0;

      for (let i = 0; i < testCases.length; i++) {
        const example = testCases[i];
        const response = await axios.post(
          "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
          {
            source_code: code,
            language_id: langId,
            stdin: example.input || "",
          }
        );

        const data = response.data;
        const compileOutput = data.compile_output;
        const stderr = data.stderr;
        const stdout = data.stdout;

        const runTimeNum = parseFloat(data.time) || 0;
        if (runTimeNum > maxTime) {
          maxTime = runTimeNum;
        }
        const memoryNum = parseInt(data.memory) || 0;
        if (memoryNum > maxMemory) {
          maxMemory = memoryNum;
        }

        if (data.status?.id === 6 || compileOutput) {
          return res.status(200).json({
            success: false,
            status: "Compilation Error",
            output: compileOutput || stderr || "Compilation Error",
            message: `Compilation Error on Test Case ${i + 1}:\n${compileOutput || stderr || "Compilation Error"}`,
          });
        }

        if (stderr || (data.status?.id > 3 && data.status?.id !== 6)) {
          return res.status(200).json({
            success: false,
            status: data.status?.description || "Runtime Error",
            output: stderr || stdout || "Execution failed",
            message: `Runtime Error on Test Case ${i + 1} (${data.status?.description || "Error"}):\n${stderr || stdout || "Execution failed"}`,
          });
        }

        const output = (stdout || "").trim();
        const expectedOutput = (example.output || "").trim();

        if (output !== expectedOutput) {
          return res.status(200).json({
            success: false,
            status: "Wrong Answer",
            output: output,
            expectedOutput: expectedOutput,
            message: `Wrong Answer on Test Case ${i + 1}.\nExpected: ${expectedOutput}\nGot: ${output}`,
          });
        }
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
        runtime: maxTime ? maxTime.toFixed(3) + " s" : "--",
        memory: maxMemory ? maxMemory + " KB" : "--",
      });
    } catch (error) {
      console.error("Submit Code Error:", error.response?.data || error.message);
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
      javascript: 102, // Node.js 22.08.0
      python: 100,     // Python 3.12.5
      java: 91,        // Java JDK 17.0.6
      cpp: 105,        // C++ GCC 14.1.0
      c: 103,          // C GCC 14.1.0
    };

    const langId = languageMap[language];

    if (!langId) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: langId,
        stdin:
          input ||
          problem.examples?.[0]?.input ||
          "",
      }
    );

    const data = response.data;
    const compileOutput = data.compile_output;
    const stderr = data.stderr;
    const stdout = data.stdout;
    const runTime = data.time ? data.time + " s" : "--";
    const memory = data.memory ? data.memory + " KB" : "--";
    const statusDesc = data.status?.description || "";

    if (data.status?.id === 6 || compileOutput) {
      return res.json({
        status: "Compilation Error",
        output: compileOutput || stderr || "Compilation Error",
        runtime: runTime,
        memory: memory,
      });
    }

    if (stderr || (data.status?.id > 3 && data.status?.id !== 6)) {
      return res.json({
        status: statusDesc || "Runtime Error",
        output: stderr || stdout || "Execution failed",
        runtime: runTime,
        memory: memory,
      });
    }

    const output = (stdout || "").trim();

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
      runtime: runTime,
      memory: memory,
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