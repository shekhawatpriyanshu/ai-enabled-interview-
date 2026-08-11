const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },

    output: {
      type: mongoose.Schema.Types.Mixed,
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

    // AI-generated function metadata
    functionName: {
      type: String,
      default: "solve",
    },

    parameters: [
      {
        name: { type: String },
        type: { type: String },
      },
    ],

    returnType: {
      type: String,
      default: "string",
    },

    helperClasses: [
      {
        type: String,
      },
    ],

    // Test cases for submission judging (with hidden flag)
    testCases: [testCaseSchema],

    // Examples for display (same structure, typically visible)
    examples: [
      {
        input: {
          type: mongoose.Schema.Types.Mixed,
          default: "",
        },
        output: {
          type: mongoose.Schema.Types.Mixed,
          default: "",
        },
        explanation: {
          type: String,
          default: "",
        },
      },
    ],

    limits: {
      time: { type: Number, default: 2 },
      memory: { type: Number, default: 128 },
    },

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

    // Legacy boilerPlate field (for backwards compatibility)
    boilerPlate: [
      {
        language: { type: String },
        code: { type: String },
      },
    ],

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

codingProblemSchema.post('save', function(doc) {
  if (global.socketIo) {
    const isNew = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    if (isNew) {
      global.socketIo.emit("new_activity", {
        type: "Coding",
        text: `Coding problem added: ${doc.title}`,
        createdAt: doc.createdAt || new Date(),
        icon: "💻"
      });
    }
  }
});

module.exports = mongoose.model(
  "CodingProblem",
  codingProblemSchema
);