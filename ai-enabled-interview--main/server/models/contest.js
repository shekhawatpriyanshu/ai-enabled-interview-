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
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},

isPublished: {
    type: Boolean,
    default: false,
},

isActive: {
    type: Boolean,
    default: true,
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

contestSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

contestSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model(
  "Contest",
  contestSchema
);