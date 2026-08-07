const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    userType: {
      type: String,
      enum: ["Student", "Working Professional"],
      default: "Student",
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    targetRole: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.post('save', async function(doc) {
  if (global.socketIo) {
    const isNew = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    try {
      await doc.populate('user', 'name');
      const userName = doc.user ? doc.user.name : "a user";
      global.socketIo.emit("new_activity", {
        type: "Profile",
        text: isNew ? `Profile created for ${userName}` : `Profile updated for ${userName}`,
        createdAt: doc.updatedAt || new Date(),
        icon: "📝"
      });
    } catch (e) {
      console.error(e);
    }
  }
});

profileSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && global.socketIo) {
    try {
      await doc.populate('user', 'name');
      const userName = doc.user ? doc.user.name : "a user";
      global.socketIo.emit("new_activity", {
        type: "Profile",
        text: `Profile updated for ${userName}`,
        createdAt: doc.updatedAt || new Date(),
        icon: "📝"
      });
    } catch (e) {
      console.error(e);
    }
  }
});

module.exports = mongoose.model("Profile", profileSchema);