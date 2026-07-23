const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    constraints: [
      {
        type: String,
      },
    ],

    examples: [exampleSchema],

    starterCode: {
      javascript: {
        type: String,
        default: "",
      },

      java: {
        type: String,
        default: "",
      },

      python: {
        type: String,
        default: "",
      },

      cpp: {
        type: String,
        default: "",
      },

      c: {
        type: String,
        default: "",
      },
    },

    solution: {
      type: String,
      default: "",
      select: false,
    },

    supportedLanguages: [
      {
        type: String,
        enum: [
          "javascript",
          "java",
          "python",
          "cpp",
          "c",
        ],
      },
    ],

    timeLimit: {
      type: Number,
      default: 1,
    },

    memoryLimit: {
      type: Number,
      default: 256,
    },

    status: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

codingProblemSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

codingProblemSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model(
  "CodingProblem",
  codingProblemSchema
);