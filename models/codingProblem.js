const mongoose = require("mongoose");

const codingProblemSchema =
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

      difficulty: {
        type: String,
        enum: [
          "Easy",
          "Medium",
          "Hard",
        ],
        default: "Easy",
      },

      topic: {
        type: String,
        required: true,
      },

      examples: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],

      constraints: [
        {
          type: String,
        },
      ],

      starterCode: {
        type: String,
        default: "",
      },

      solution: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "CodingProblem",
    codingProblemSchema
  );