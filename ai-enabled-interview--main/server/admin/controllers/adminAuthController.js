const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const generateAdminToken = require("../utils/generateAdminToken");
const InterviewSession = require("../../models/interviewSession");
const CodeSubmission = require("../../models/codeSubmission");
const StudyGroup = require("../../models/studyGroup");
const CodingProblem = require("../../models/codingProblem");
const Profile = require("../../models/profile");
const Activity = require("../../models/activity");
const sendEmail = require("../../utils/sendEmail");

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

    // Fetch the 10 most recent universal activities from the new Activity collection
    const recentActivityRecords = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('type text icon createdAt');

    // Convert to standard array for response
    const recentActivity = recentActivityRecords.map(a => ({
        type: a.type,
        text: a.text,
        icon: a.icon,
        createdAt: a.createdAt
    }));

    res.status(200).json({
      totalUsers,
      totalInterviews,
      totalCodingProblems,
      totalCommunities,
      activeUsers,
      recentActivity
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
      isOnline: true,
    }).select("name email isOnline");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ONLINE USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin with this email does not exist",
      });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration time (10 minutes)
    admin.resetPasswordToken = otp;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save();

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password for your Admin account. Please use the following One-Time Password (OTP) to reset your password:\n\n${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        email: admin.email,
        subject: "Admin Password Reset OTP",
        message,
      });

      res.status(200).json({
        success: true,
        message: "Password reset OTP sent to email",
      });
    } catch (error) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save();

      console.error("Email sending failed:", error);
      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Set new password
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
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
  forgotPassword,
  resetPassword,
  getOnlineUsers,
};