const mongoose = require("mongoose");

const discussionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      tags: [
        {
          type: String,
        },
      ],

      likes: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Discussion",
    discussionSchema
  );