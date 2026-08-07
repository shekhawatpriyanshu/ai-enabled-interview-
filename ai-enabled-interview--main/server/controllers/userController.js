const Profile = require("../models/profile");

// Helper to extract fields from request
const parseProfileFields = (req) => {
  const fields = {
    userType: req.body.userType || "Student",
    bio: req.body.bio || "",
    college: req.body.college || "",
    degree: req.body.degree || "",
    company: req.body.company || "",
    designation: req.body.designation || "",
    targetRole: req.body.targetRole || "",
    experience: req.body.experience || "",
    location: req.body.location || "",
    github: req.body.github || "",
    linkedin: req.body.linkedin || "",
  };

  if (req.body.skills) {
    fields.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : req.body.skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  } else {
    fields.skills = [];
  }

  if (req.file) {
    fields.avatar = req.file.location;
  }

  return fields;
};

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    console.log("Create Profile - BODY:", req.body);
    console.log("Create Profile - FILE:", req.file);

    const profileExists = await Profile.findOne({
      user: req.user._id,
    });

    const updateData = parseProfileFields(req);

    if (profileExists) {
      console.log("Profile already exists, redirecting to update logic internally...");
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        updateData,
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully (fallback from create)",
        profile: updatedProfile,
      });
    }

    const profile = await Profile.create({
      user: req.user._id,
      ...updateData,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "name email role");

    if (!profile) {
      return res.status(200).json({
        success: false,
        message: "Profile not found",
        profile: null,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    console.log("Update Profile - BODY:", req.body);
    console.log("Update Profile - FILE:", req.file);

    const updateData = parseProfileFields(req);

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      updateData,
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PROFILE
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};