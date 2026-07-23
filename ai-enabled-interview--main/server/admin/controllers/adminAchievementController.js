const Achievement = require("../../models/achievement");
const Badge = require("../../models/Badge");
const UserReward = require("../../models/userReward");

// ============================================
// ADMIN ACHIEVEMENT DASHBOARD
// GET /api/admin/achievement/dashboard
// ============================================

const getDashboard = async (req, res) => {
  try {
    const [
      totalAchievements,
      totalBadges,
      totalRewards,
      activeAchievements,
      inactiveAchievements,
      recentAchievements,
    ] = await Promise.all([
      Achievement.countDocuments(),

      Badge.countDocuments(),

      UserReward.countDocuments(),

      Achievement.countDocuments({
        isActive: true,
      }),

      Achievement.countDocuments({
        isActive: false,
      }),

      Achievement.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("badge", "title icon"),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalAchievements,
        totalBadges,
        totalRewards,
        activeAchievements,
        inactiveAchievements,
        recentAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET ALL ACHIEVEMENTS
// GET /api/admin/achievement
// ============================================

const getAchievements = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const category = req.query.category || "";

    const status = req.query.status;

    const sort = req.query.sort || "latest";

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (status !== undefined && status !== "") {
      query.isActive = status === "true";
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "title":
        sortOption = {
          title: 1,
        };
        break;

      case "target":
        sortOption = {
          target: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const [achievements, total] =
      await Promise.all([
        Achievement.find(query)
          .populate("badge", "title icon")
          .sort(sortOption)
          .skip(skip)
          .limit(limit),

        Achievement.countDocuments(query),
      ]);

    res.status(200).json({
      success: true,

      page,

      totalPages: Math.ceil(total / limit),

      total,

      count: achievements.length,

      achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET SINGLE ACHIEVEMENT
// GET /api/admin/achievement/:id
// ============================================

const getAchievementById = async (
  req,
  res
) => {
  try {
    const achievement =
      await Achievement.findById(
        req.params.id
      ).populate(
        "badge",
        "title description icon"
      );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message:
          "Achievement not found",
      });
    }

    const totalEarned =
      await UserReward.countDocuments({
        achievement: achievement._id,
      });

    res.status(200).json({
      success: true,

      achievement,

      statistics: {
        totalEarned,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// CREATE ACHIEVEMENT
// POST /api/admin/achievement
// ============================================

const createAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      target,
      category,
      badge,
      rewardPoints,
    } = req.body;

    if (
      !title ||
      !description ||
      !target ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, target and category are required.",
      });
    }

    const existingAchievement =
      await Achievement.findOne({
        title: title.trim(),
      });

    if (existingAchievement) {
      return res.status(409).json({
        success: false,
        message:
          "Achievement with this title already exists.",
      });
    }

    if (badge) {
      const badgeExists =
        await Badge.findById(badge);

      if (!badgeExists) {
        return res.status(404).json({
          success: false,
          message: "Badge not found.",
        });
      }
    }

    const achievement =
      await Achievement.create({
        title: title.trim(),
        description,
        target,
        category,
        badge: badge || null,
        rewardPoints:
          rewardPoints || 0,
      });

    const populatedAchievement =
      await Achievement.findById(
        achievement._id
      ).populate(
        "badge",
        "title icon description"
      );

    res.status(201).json({
      success: true,
      message:
        "Achievement created successfully.",
      achievement:
        populatedAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// ============================================
// UPDATE ACHIEVEMENT
// PUT /api/admin/achievement/:id
// ============================================

const updateAchievement = async (
  req,
  res
) => {
  try {
    const achievement =
      await Achievement.findById(
        req.params.id
      );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message:
          "Achievement not found.",
      });
    }

    const {
      title,
      description,
      target,
      category,
      badge,
      rewardPoints,
      isActive,
    } = req.body;

    if (
      title &&
      title !== achievement.title
    ) {
      const duplicate =
        await Achievement.findOne({
          title: title.trim(),
          _id: {
            $ne: achievement._id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Achievement title already exists.",
        });
      }

      achievement.title =
        title.trim();
    }

    if (description)
      achievement.description =
        description;

    if (target)
      achievement.target = target;

    if (category)
      achievement.category =
        category;

    if (rewardPoints !== undefined)
      achievement.rewardPoints =
        rewardPoints;

    if (isActive !== undefined)
      achievement.isActive =
        isActive;

    if (badge !== undefined) {
      if (badge) {
        const badgeExists =
          await Badge.findById(badge);

        if (!badgeExists) {
          return res.status(404).json({
            success: false,
            message:
              "Badge not found.",
          });
        }

        achievement.badge = badge;
      } else {
        achievement.badge = null;
      }
    }

    await achievement.save();

    const updatedAchievement =
      await Achievement.findById(
        achievement._id
      ).populate(
        "badge",
        "title icon description"
      );

    res.status(200).json({
      success: true,
      message:
        "Achievement updated successfully.",
      achievement:
        updatedAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================================
// DELETE ACHIEVEMENT
// DELETE /api/admin/achievement/:id
// ============================================

const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(
      req.params.id
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found.",
      });
    }

    // Check if users have already earned this achievement
    const rewardCount =
      await UserReward.countDocuments({
        achievement: achievement._id,
      });

    if (rewardCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This achievement has already been earned by users. Disable it instead of deleting.",
      });
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Achievement deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// ============================================
// TOGGLE ACHIEVEMENT STATUS
// PATCH /api/admin/achievement/:id/status
// ============================================

const toggleAchievementStatus = async (
  req,
  res
) => {
  try {
    const achievement =
      await Achievement.findById(
        req.params.id
      );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message:
          "Achievement not found.",
      });
    }

    achievement.isActive =
      !achievement.isActive;

    await achievement.save();

    res.status(200).json({
      success: true,
      message: `Achievement ${
        achievement.isActive
          ? "activated"
          : "deactivated"
      } successfully.`,
      achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// ============================================
// ACHIEVEMENT STATISTICS
// GET /api/admin/achievement/statistics
// ============================================

const getAchievementStatistics =
  async (req, res) => {
    try {
      const categoryStats =
        await Achievement.aggregate([
          {
            $group: {
              _id: "$category",
              total: {
                $sum: 1,
              },
            },
          },
        ]);

      const rewardStats =
        await UserReward.aggregate([
          {
            $group: {
              _id: "$achievement",
              totalEarned: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              totalEarned: -1,
            },
          },
        ]);

      res.status(200).json({
        success: true,
        categoryStats,
        rewardStats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  // ============================================
// GET ALL BADGES
// GET /api/admin/achievement/badges
// ============================================

const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ title: 1 });
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

module.exports = {
  getDashboard,

  getAchievements,

  getAchievementById,

  createAchievement,

  updateAchievement,

  deleteAchievement,

  toggleAchievementStatus,

  getAchievementStatistics,

  getBadges,
};