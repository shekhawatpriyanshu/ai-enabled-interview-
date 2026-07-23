const mongoose = require("mongoose");

const analyticsSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      questionsSolved: {
        type: Number,
        default: 0,
      },

      testsCompleted: {
        type: Number,
        default: 0,
      },

      codingSolved: {
        type: Number,
        default: 0,
      },

      contestsParticipated: {
        type: Number,
        default: 0,
      },

      interviewsCompleted: {
        type: Number,
        default: 0,
      },

      totalScore: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Analytics",
    analyticsSchema
  );