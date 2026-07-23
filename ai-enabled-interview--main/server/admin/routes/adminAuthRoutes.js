const express = require("express");

const {
  adminLogin,
  getAdminProfile,
  adminLogout,
  getDashboardStats,
} = require("../controllers/adminAuthController");

const adminProtect = require("../middlewares/adminProtect");

const router = express.Router();

/**
 * @route   POST /api/admin/auth/login
 * @desc    Admin Login
 * @access  Public
 */
router.post("/login", adminLogin);

/**
 * @route   GET /api/admin/auth/me
 * @desc    Get Logged In Admin
 * @access  Private
 */
router.get("/me", adminProtect, getAdminProfile);

/**
 * @route   POST /api/admin/auth/logout
 * @desc    Logout Admin
 * @access  Private
 */
router.post("/logout", adminProtect, adminLogout);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get Dashboard Statistics
 * @access  Private (Admin Only)
 */
router.get("/dashboard", adminProtect, getDashboardStats);

module.exports = router;