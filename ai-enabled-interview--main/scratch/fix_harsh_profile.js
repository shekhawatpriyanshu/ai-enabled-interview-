const path = require("path");
const mongoose = require(path.join(__dirname, "../server/node_modules/mongoose"));

require(path.join(__dirname, "../server/node_modules/dotenv")).config({ path: path.join(__dirname, "../server/.env") });
const Profile = require(path.join(__dirname, "../server/models/profile.js"));
const User = require(path.join(__dirname, "../server/models/user.js"));

const fixHarsh = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const harshUser = await User.findOne({ email: "harsh@gmail.com" });
    if (harshUser) {
      const updated = await Profile.findOneAndUpdate(
        { user: harshUser._id },
        { userType: "Working Professional" },
        { new: true }
      );
      console.log("Updated Harsh Profile:", updated);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixHarsh();
