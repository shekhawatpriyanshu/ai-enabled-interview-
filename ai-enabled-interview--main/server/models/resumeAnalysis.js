const mongoose = require("mongoose");

const schema =
  new mongoose.Schema(
    {
      resume: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      atsScore: Number,

      skillsMatch: [String],

      missingSkills: [String],

      strengths: [String],

      weaknesses: [String],

      suggestions: [String],

      resumeSummary: String,

      experienceAnalysis: String,

      projectsAnalysis: String,

      keywordMatch: {
        matched: Number,
        total: Number,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ResumeAnalysis",
    schema
  );