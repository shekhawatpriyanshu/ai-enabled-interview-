const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const generateAdminToken = require("../utils/generateAdminToken");
const InterviewSession = require("../../models/interviewSession");
const CodeSubmission = require("../../models/codeSubmission");
const StudyGroup = require("../../models/studyGroup");
const CodingProblem = require("../../models/codingProblem");

/**
 * @desc    Admin Login
 * @route   POST /api/admin/auth/login
 * @access  Public (Admin Only)
 */

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Find admin in Admin collection
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check role
    if (
      admin.role !== "admin" &&
      admin.role !== "super_admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Optional: Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate Token
    const token = generateAdminToken(
      admin._id,
      admin.role
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get Logged In Admin
 * @route   GET /api/admin/auth/me
 * @access  Private
 */

const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/auth/logout
 * @access  Private
 */

const adminLogout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalInterviews = await InterviewSession.countDocuments();
    const totalCodingProblems = await CodingProblem.countDocuments();
    const totalCommunities = await StudyGroup.countDocuments();
    
    const activeUsers = await User.countDocuments({
      role: "user",
      isOnline: true,
    });

    res.status(200).json({
      totalUsers,
      totalInterviews,
      totalCodingProblems,
      totalCommunities,
      activeUsers
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  adminLogout,
  getDashboardStats,
};