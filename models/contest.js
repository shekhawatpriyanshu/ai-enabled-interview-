const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodingProblem",
      },
    ],

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Live",
        "Completed",
      ],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Contest",
  contestSchema
);