const mongoose = require("mongoose");

const achievementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      target: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        enum: [
          "questions",
          "coding",
          "tests",
          "contests",
          "interviews",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Achievement",
    achievementSchema
  );