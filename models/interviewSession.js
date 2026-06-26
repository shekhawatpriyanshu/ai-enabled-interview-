const mongoose = require("mongoose");

const interviewSessionSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      role: {
        type: String,
        required: true,
      },

      experienceLevel: {
        type: String,
        enum: [
          "Fresher",
          "Junior",
          "Mid",
          "Senior",
        ],
        default: "Fresher",
      },

      questions: [
        {
          question: String,
          answer: String,
        },
      ],

      status: {
        type: String,
        enum: [
          "Started",
          "Completed",
        ],
        default: "Started",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);