const Analytics =
  require("../models/Analytics");

const Badge =
  require("../models/Badge");

const Achievement =
  require("../models/Achievement");

const UserReward =
  require("../models/UserReward");


// CREATE USER ANALYTICS

const createAnalytics =
  async (req, res) => {
    try {
      const existing =
        await Analytics.findOne({
          user:
            req.user._id,
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Analytics already exists",
        });
      }

      const analytics =
        await Analytics.create({
          user:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        analytics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// GET MY ANALYTICS

const getMyAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await Analytics.findOne({
          user:
            req.user._id,
        });

      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// UPDATE ANALYTICS

const updateAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await Analytics.findOneAndUpdate(
          {
            user:
              req.user._id,
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
        message:
          error.message,
      });
    }
  };


// CREATE BADGE

const createBadge =
  async (req, res) => {
    try {
      const badge =
        await Badge.create(
          req.body
        );

      res.status(201).json({
        success: true,
        badge,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// CREATE ACHIEVEMENT

const createAchievement =
  async (req, res) => {
    try {
      const achievement =
        await Achievement.create(
          req.body
        );

      res.status(201).json({
        success: true,
        achievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ASSIGN REWARD

const assignReward =
  async (req, res) => {
    try {
      const reward =
        await UserReward.create({
          user:
            req.body.user,
          badge:
            req.body.badge,
          achievement:
            req.body.achievement,
        });

      res.status(201).json({
        success: true,
        reward,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// MY REWARDS

const getMyRewards =
  async (req, res) => {
    try {
      const rewards =
        await UserReward.find({
          user:
            req.user._id,
        })
          .populate(
            "badge"
          )
          .populate(
            "achievement"
          );

      res.status(200).json({
        success: true,
        rewards,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  createAnalytics,
  getMyAnalytics,
  updateAnalytics,
  createBadge,
  createAchievement,
  assignReward,
  getMyRewards,
};