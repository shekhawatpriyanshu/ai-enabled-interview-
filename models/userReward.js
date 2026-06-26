const mongoose = require("mongoose");

const userRewardSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      badge: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },

      achievement: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },

      earnedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "UserReward",
    userRewardSchema
  );