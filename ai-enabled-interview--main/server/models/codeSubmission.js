const mongoose = require("mongoose");

const codeSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProblem",
      required: true,
    },

    language: {
      type: String,
      enum: [
        "javascript",
        "java",
        "python",
        "cpp",
        "c",
      ],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
      ],
      default: "Accepted",
    },

    score: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: String,
      default: "--",
    },

    memory: {
      type: String,
      default: "--",
    },

    passedTestCases: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CodeSubmission",
  codeSubmissionSchema
);