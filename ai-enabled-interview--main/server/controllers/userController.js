const Profile = require("../models/profile");

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    console.log("Create Profile - BODY:", req.body);
    console.log("Create Profile - FILE:", req.file);

    const profileExists =
      await Profile.findOne({
        user: req.user._id,
      });

    if (profileExists) {
      console.log("Profile already exists, redirecting to update logic internally...");
      // Update the existing profile instead of failing with 400
      const updateData = {
        bio: req.body.bio,
        college: req.body.college,
        skills: req.body.skills ? req.body.skills.split(",") : [],
        github: req.body.github,
        linkedin: req.body.linkedin,
        experience: req.body.experience,
        location: req.body.location,
      };
      
      if (req.file) {
        updateData.avatar = req.file.location;
      }

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

    const profile =
      await Profile.create({
        user: req.user._id,

        avatar: req.file
          ? req.file.location
          : "",

        bio: req.body.bio,
        college: req.body.college,

        skills: req.body.skills
          ? req.body.skills.split(",")
          : [],

        github: req.body.github,
        linkedin: req.body.linkedin,
        experience:
          req.body.experience,
        location:
          req.body.location,
      });

    res.status(201).json({
      success: true,
      message:
        "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const profile =
      await Profile.findOne({
        user: req.user._id,
      }).populate(
        "user",
        "name email role"
      );

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
const updateProfile = async (
  req,
  res
) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const updateData = {
      bio: req.body.bio,
      college: req.body.college,

      skills: req.body.skills
        ? req.body.skills.split(",")
        : [],

      github: req.body.github,
      linkedin: req.body.linkedin,
      experience:
        req.body.experience,
      location:
        req.body.location,
    };

    if (req.file) {
      updateData.avatar =
        req.file.location;
    }

    const profile =
      await Profile.findOneAndUpdate(
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
        message:
          "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Profile updated",
      profile,
    });
    if (req.file) {
      console.log("Uploaded File:", req.file);
      updateData.avatar = req.file.location;
    }

    console.log("Update Data:", updateData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PROFILE
const deleteProfile = async (req, res) => {
  try {
    const profile =
      await Profile.findOneAndDelete({
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