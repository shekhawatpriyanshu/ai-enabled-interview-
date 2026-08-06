const mongoose = require("mongoose");

const studyGroupSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      owner: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      members: [
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

studyGroupSchema.post('save', function(doc) {
  if (global.socketIo) {
    const isNew = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    if (isNew) {
      global.socketIo.emit("new_activity", {
        type: "Community",
        text: `Community created: ${doc.name}`,
        createdAt: doc.createdAt || new Date(),
        icon: "👥"
      });
    }
  }
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);