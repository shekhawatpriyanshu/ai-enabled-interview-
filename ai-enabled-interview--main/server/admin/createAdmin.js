const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");
const Admin = require("../models/admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clean up legacy admin from User collection
    await User.deleteMany({ role: "admin" });
    console.log("Cleared legacy admin accounts from User collection.");

    const existingAdmin = await Admin.findOne({
      email: "shekhawatpriyanshu@gmail.com",
    });

    const hashedPassword = await bcrypt.hash("Shekhawat@123", 10);

    if (existingAdmin) {
      existingAdmin.name = "Admin";
      existingAdmin.role = "admin";
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("✅ Admin updated successfully in Admins collection");
      process.exit();
    }

    await Admin.create({
      name: "Admin",
      email: "shekhawatpriyanshu@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully in Admins collection");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();