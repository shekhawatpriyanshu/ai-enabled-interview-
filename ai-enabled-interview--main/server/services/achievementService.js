const Analytics = require("../models/analytics");
const Achievement = require("../models/achievement");
const UserReward = require("../models/userReward");
const Badge = require("../models/Badge");
    const {
 createReward
}
=
require("./rewardService");

/**
 * Check and award achievements for a user
 * @param {String} userId
 * @returns {Array} newly unlocked achievements
 */

const checkAchievements = async (userId) => {
  try {
    const analytics = await Analytics.findOne({
      user: userId,
    });

    if (!analytics) {
      return [];
    }

    const achievements = await Achievement.find({
      isActive: true,
    }).populate("badge");

    const unlockedAchievements = [];

    for (const achievement of achievements) {
      let currentValue = 0;

      switch (achievement.category) {
        case "questions":
          currentValue =
            analytics.questionsSolved || 0;
          break;

        case "coding":
          currentValue =
            analytics.codingSolved || 0;
          break;

        case "tests":
          currentValue =
            analytics.testsCompleted || 0;
          break;

        case "contests":
          currentValue =
            analytics.contestsParticipated || 0;
          break;

        case "interviews":
          currentValue =
            analytics.interviewsCompleted || 0;
          break;

        default:
          currentValue = 0;
      }

      // Achievement not completed
      if (currentValue < achievement.target)
        continue;

      // Already rewarded
      const alreadyRewarded =
        await UserReward.findOne({
          user: userId,
          achievement: achievement._id,
        });

      if (alreadyRewarded) continue;

      // Create reward
  

      const reward = await createReward({
        userId,
        achievementId: achievement._id,
        badgeId: achievement.badge?._id || null,
        rewardPoints: achievement.rewardPoints || 0
      });

      unlockedAchievements.push({
        reward,
        achievement,
      });
    }

    return unlockedAchievements;
  } catch (error) {
    console.log(error);

    return [];
  }
};

module.exports = {
  checkAchievements,
};