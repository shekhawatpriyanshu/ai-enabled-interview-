const express = require("express");

const router = express.Router();

const adminProtect = require("../middlewares/adminProtect");

const authorize = require("../middlewares/authorize");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  changeStatus,
  getUserStats,
} = require("../controllers/userManagementController");

/*
=========================================================
                 USER MANAGEMENT ROUTES
=========================================================
*/

// Get Dashboard User Stats
router.get(
  "/stats",
  adminProtect,
  authorize("admin", "super_admin"),
  getUserStats
);

// Get All Users
router.get(
  "/",
  adminProtect,
  authorize("admin", "super_admin"),
  getUsers
);

// Get Single User
router.get(
  "/:id",
  adminProtect,
  authorize("admin", "super_admin"),
  getUserById
);

// Update User
router.put(
  "/:id",
  adminProtect,
  authorize("admin", "super_admin"),
  updateUser
);

// Change User Role
router.patch(
  "/:id/role",
  adminProtect,
  authorize("admin", "super_admin"),
  changeRole
);

// Block / Unblock User
router.patch(
  "/:id/status",
  adminProtect,
  authorize("admin", "super_admin"),
  changeStatus
);

// Delete User
router.delete(
  "/:id",
  adminProtect,
  authorize("admin", "super_admin"),
  deleteUser
);

module.exports = router;