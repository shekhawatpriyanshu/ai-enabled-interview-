const Analytics = require("../models/analytics");
const Badge = require("../models/Badge");
const Achievement = require("../models/achievement");
const UserReward = require("../models/userReward");


const {
  checkAchievements,
} = require("../services/achievementService");


const InterviewSession = require("../models/interviewSession");
const Submission = require("../models/submission");
const CodeSubmission = require("../models/codeSubmission");
const ContestSubmission = require("../models/contestSubmission");

// ========================================
// CREATE ANALYTICS
// ========================================

const createAnalytics = async (req, res) => {
  try {
    const existing = await Analytics.findOne({
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Analytics already exists",
      });
    }

    const analytics = await Analytics.create({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET MY ANALYTICS
// ========================================

const getMyAnalytics = async (req, res) => {
  try {
    let analytics = await Analytics.findOne({
      user: req.user._id,
    });

    if (!analytics) {
      analytics = await Analytics.create({
        user: req.user._id,
      });
    }

    const interviewsCompleted =
      await InterviewSession.countDocuments({
        user: req.user._id,
        status: "Completed",
      });

    const testsCompleted =
      await Submission.countDocuments({
        user: req.user._id,
      });

    const codingSolved =
      await CodeSubmission.countDocuments({
        user: req.user._id,
        status: "Accepted",
      });

    const contestsParticipated =
      await ContestSubmission.countDocuments({
        user: req.user._id,
      });

    const submissions = await Submission.find({
      user: req.user._id,
    });

    let questionsSolved = 0;

    submissions.forEach((submission) => {
      questionsSolved += submission.totalQuestions || 0;
    });

    questionsSolved += codingSolved;

    analytics.interviewsCompleted =
      interviewsCompleted;

    analytics.testsCompleted =
      testsCompleted;

    analytics.codingSolved =
      codingSolved;

    analytics.contestsParticipated =
      contestsParticipated;

    analytics.questionsSolved =
      questionsSolved;

    let totalScore = 0;

    submissions.forEach((submission) => {
      totalScore += submission.score || 0;
    });

    const codingSubmissions =
      await CodeSubmission.find({
        user: req.user._id,
        status: "Accepted",
      });

    codingSubmissions.forEach((submission) => {
      totalScore += submission.score || 0;
    });

    const contestSubmissions =
      await ContestSubmission.find({
        user: req.user._id,
      });

    contestSubmissions.forEach((submission) => {
      totalScore += submission.score || 0;
    });

    analytics.totalScore = totalScore;

    await analytics.save();
const unlockedAchievements =
  await checkAchievements(req.user._id);

    res.status(200).json({
      success: true,
      analytics,
      unlockedAchievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE ANALYTICS
// ========================================

const updateAnalytics = async (req, res) => {
  try {
    const analytics =
      await Analytics.findOneAndUpdate(
        {
          user: req.user._id,
        },
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET MY REWARDS
// ========================================

const getMyRewards = async (req, res) => {
  try {
    const rewards =
      await UserReward.find({
        user: req.user._id,
      })
        .populate("badge")
        .populate("achievement");

    res.status(200).json({
      success: true,
      rewards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET BADGES
// ========================================

const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({
      createdAt: 1,
    });

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

// ========================================
// GET ACHIEVEMENTS
// ========================================

const getAchievements = async (req, res) => {
  try {
    const achievements =
      await Achievement.find().sort({
        target: 1,
      });

    res.status(200).json({
      success: true,
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

module.exports = {
  createAnalytics,
  getMyAnalytics,
  updateAnalytics,
  getMyRewards,
  getBadges,
  getAchievements,
};