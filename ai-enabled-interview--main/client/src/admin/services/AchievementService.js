import API from "./adminApi";

const AchievementService = {
  // ==========================================
  // DASHBOARD
  // ==========================================

  getDashboard: async () => {
    const { data } = await API.get(
      "/achievement/dashboard"
    );

    return data;
  },

  // ==========================================
  // GET ALL ACHIEVEMENTS
  // ==========================================

  getAchievements: async (params = {}) => {
    const { data } = await API.get(
      "/achievement",
      {
        params,
      }
    );

    return data;
  },

  // ==========================================
  // GET SINGLE ACHIEVEMENT
  // ==========================================

  getAchievementById: async (id) => {
    const { data } = await API.get(
      `/achievement/${id}`
    );

    return data;
  },

  // ==========================================
  // CREATE ACHIEVEMENT
  // ==========================================

  createAchievement: async (
    achievementData
  ) => {
    const { data } = await API.post(
      "/achievement",
      achievementData
    );

    return data;
  },

  // ==========================================
  // UPDATE ACHIEVEMENT
  // ==========================================

  updateAchievement: async (
    id,
    achievementData
  ) => {
    const { data } = await API.put(
      `/achievement/${id}`,
      achievementData
    );

    return data;
  },

  // ==========================================
  // DELETE ACHIEVEMENT
  // ==========================================

  deleteAchievement: async (id) => {
    const { data } = await API.delete(
      `/achievement/${id}`
    );

    return data;
  },

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  toggleAchievementStatus: async (
    id
  ) => {
    const { data } = await API.patch(
      `/achievement/${id}/status`
    );

    return data;
  },

  // ==========================================
  // STATISTICS
  // ==========================================

  getStatistics: async () => {
    const { data } = await API.get(
      "/achievement/statistics"
    );

    return data;
  },

  // ==========================================
  // BADGES
  // ==========================================

  getBadges: async () => {
    const { data } = await API.get(
      "/achievement/badges"
    );

    return data;
  },
};

export default AchievementService;