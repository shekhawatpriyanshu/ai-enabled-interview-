const mongoose = require("mongoose");

const contestSubmissionSchema =
  new mongoose.Schema(
    {
      contest: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true,
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      score: {
        type: Number,
        default: 0,
      },

      solvedProblems: {
        type: Number,
        default: 0,
      },

      totalProblems: {
        type: Number,
        default: 0,
      },

      rank: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ContestSubmission",
  contestSubmissionSchema
);