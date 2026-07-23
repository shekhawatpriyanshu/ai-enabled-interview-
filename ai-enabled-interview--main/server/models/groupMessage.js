const mongoose = require("mongoose");

const groupMessageSchema =
  new mongoose.Schema(
    {
      group: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      message: {
        type: String,
        default: "",
      },

      fileUrl: {
        type: String,
        default: "",
      },

      fileType: {
        type: String,
        default: "",
      },

      fileName: {
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
    "GroupMessage",
    groupMessageSchema
  );