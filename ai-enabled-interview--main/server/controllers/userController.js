const Profile = require("../models/profile");

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    const profileExists =
      await Profile.findOne({
        user: req.user._id,
      });

    if (profileExists) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile =
      await Profile.create({
        user: req.user._id,

        avatar: req.file
          ? req.file.path
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
        req.file.path;
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