const mongoose = require("mongoose");

const codeSubmissionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      problem: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "CodingProblem",
        required: true,
      },

      code: {
        type: String,
        required: true,
      },

      language: {
        type: String,
        enum: [
          "javascript",
          "java",
          "python",
          "cpp",
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Accepted",
          "Wrong Answer",
          "Runtime Error",
        ],
        default: "Accepted",
      },

      score: {
        type: Number,
        default: 100,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "CodeSubmission",
    codeSubmissionSchema
  );