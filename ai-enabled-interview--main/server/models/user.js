const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    lastLogin: {
  type: Date,
},
socketId:{
  type:String,
  default:null

},
isOnline: {
  type: Boolean,
  default: false,
},
lastSeen: {
  type: Date,
},
isBlocked: {
  type: Boolean,
  default: false,
},

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    refreshToken: {
      type: String,
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

userSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

userSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model("User", userSchema);