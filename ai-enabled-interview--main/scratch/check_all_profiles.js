const path = require("path");
const mongoose = require(path.join(__dirname, "../server/node_modules/mongoose"));

require(path.join(__dirname, "../server/node_modules/dotenv")).config({ path: path.join(__dirname, "../server/.env") });
const Profile = require(path.join(__dirname, "../server/models/profile.js"));
const User = require(path.join(__dirname, "../server/models/user.js"));

const checkAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const profiles = await Profile.find({}).populate("user", "name email");
    console.log("All Profiles Data:");
    profiles.forEach(p => {
      console.log(`User: ${p.user?.name} (${p.user?.email}) | userType: ${p.userType} | ID: ${p._id}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAll();
