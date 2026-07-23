const Badge = require("../../models/Badge");
const Achievement = require("../../models/achievement");

// ============================================
// GET ALL BADGES
// GET /api/admin/badges
// ============================================
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: badges.length,
      badges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// CREATE BADGE
// POST /api/admin/badges
// ============================================
const createBadge = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const badge = await Badge.create({
      title: title.trim(),
      description: description.trim(),
      icon: icon || "",
    });

    res.status(201).json({
      success: true,
      message: "Badge created successfully.",
      badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE BADGE
// PUT /api/admin/badges/:id
// ============================================
const updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found.",
      });
    }

    const { title, description, icon } = req.body;

    if (title) badge.title = title.trim();
    if (description) badge.description = description.trim();
    if (icon !== undefined) badge.icon = icon;

    await badge.save();

    res.status(200).json({
      success: true,
      message: "Badge updated successfully.",
      badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// DELETE BADGE
// DELETE /api/admin/badges/:id
// ============================================
const deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found.",
      });
    }

    // Prevent deletion if badge is linked to achievements
    const linkedAchievements = await Achievement.countDocuments({
      badge: badge._id,
    });

    if (linkedAchievements > 0) {
      return res.status(400).json({
        success: false,
        message: "This badge is currently linked to achievements. Remove it from achievements first.",
      });
    }

    await badge.deleteOne();

    res.status(200).json({
      success: true,
      message: "Badge deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
};
