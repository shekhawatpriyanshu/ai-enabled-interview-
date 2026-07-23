const User = require("../../models/user");

/**
 * =====================================================
 * GET ALL USERS
 * GET /api/admin/users
 * =====================================================
 */

const getUsers = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      role,
      verified,
      blocked,
      sort = "newest",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = { role: "user" };

    // Search
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Verification Filter
    if (verified !== undefined && verified !== "") {
      if (verified === "true") {
        query.isVerified = true;
      } else if (verified === "false") {
        query.isVerified = { $ne: true };
      }
    }

    // Block Filter
    if (blocked !== undefined && blocked !== "") {
      query.isBlocked = blocked === "true";
    }

    // Sorting
    let sortOption = {};

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    } else {
      sortOption = {
        createdAt: -1,
      };
    }

    const totalUsers =
      await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(
          totalUsers / limit
        ),
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * GET SINGLE USER
 * GET /api/admin/users/:id
 * =====================================================
 */

const getUserById = async (
  req,
  res
) => {
  try {
    const user =
      await User.findOne({
        _id: req.params.id,
        role: "user",
      }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * UPDATE USER
 * PUT /api/admin/users/:id
 * =====================================================
 */

const updateUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      role,
      isVerified,
    } = req.body;

    const user =
      await User.findOne({
        _id: req.params.id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.name =
      name || user.name;

    user.email =
      email || user.email;

    if (role) {
      user.role = role;
    }

    if (
      typeof isVerified ===
      "boolean"
    ) {
      user.isVerified =
        isVerified;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * DELETE USER
 * DELETE /api/admin/users/:id
 * =====================================================
 */

const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findOne({
        _id: req.params.id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * CHANGE ROLE
 * PATCH /api/admin/users/:id/role
 * =====================================================
 */

const changeRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    if (
      ![
        "user",
        "admin",
      ].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role",
      });
    }

    const user =
      await User.findOne({
        _id: req.params.id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * BLOCK / UNBLOCK USER
 * PATCH /api/admin/users/:id/status
 * =====================================================
 */

const changeStatus = async (
  req,
  res
) => {
  try {
    const user =
      await User.findOne({
        _id: req.params.id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.isBlocked =
      !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        user.isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =====================================================
 * USER STATISTICS
 * GET /api/admin/users/stats
 * =====================================================
 */

const getUserStats =
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments({ role: "user" });

      const verifiedUsers =
        await User.countDocuments(
          {
            role: "user",
            isVerified: true,
          }
        );

      const blockedUsers =
        await User.countDocuments(
          {
            role: "user",
            isBlocked: true,
          }
        );

      const adminUsers = 0;

      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          verifiedUsers,
          blockedUsers,
          adminUsers,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  changeStatus,
  getUserStats,
};