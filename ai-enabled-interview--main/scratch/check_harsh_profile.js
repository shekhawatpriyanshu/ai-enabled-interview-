const path = require("path");
const mongoose = require(path.join(__dirname, "../server/node_modules/mongoose"));

require(path.join(__dirname, "../server/node_modules/dotenv")).config({ path: path.join(__dirname, "../server/.env") });
const Profile = require(path.join(__dirname, "../server/models/profile.js"));
const User = require(path.join(__dirname, "../server/models/user.js"));

const checkAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log("All Users:", users.map(u => ({ id: u._id, name: u.name, email: u.email })));
    const profiles = await Profile.find({});
    console.log("All Profiles userTypes:", profiles.map(p => ({ user: p.user, userType: p.userType })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAll();
