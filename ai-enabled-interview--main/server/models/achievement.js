const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
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

    target: {
      type: Number,
      required: true,
      min: 1,
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

    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      default: null,
    },

    rewardPoints: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Achievement",
  achievementSchema
);