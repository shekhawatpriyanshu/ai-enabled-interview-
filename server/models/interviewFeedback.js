const mongoose = require("mongoose");

const feedbackSchema =
  new mongoose.Schema(
    {
      interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewSession",
        required: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      score: {
        type: Number,
        default: 0,
      },

      communication: {
        type: Number,
        default: 0,
      },

      technicalKnowledge: {
        type: Number,
        default: 0,
      },

      problemSolving: {
        type: Number,
        default: 0,
      },

      strengths: [String],

      weaknesses: [String],

      suggestions: [String],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "InterviewFeedback",
  feedbackSchema
);