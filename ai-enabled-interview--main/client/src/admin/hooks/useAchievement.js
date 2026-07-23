import { useState } from "react";
import toast from "react-hot-toast";

import AchievementService from "../services/AchievementService";

const useAchievement = () => {
  const [loading, setLoading] = useState(false);

  const [dashboard, setDashboard] = useState({});

  const [statistics, setStatistics] = useState({});

  const [achievements, setAchievements] = useState([]);

  const [achievement, setAchievement] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  });

  // ==========================================
  // Dashboard
  // ==========================================

  const getDashboard = async () => {
    try {
      setLoading(true);

      const res =
        await AchievementService.getDashboard();

      if (res.success) {
        setDashboard(res.dashboard);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Statistics
  // ==========================================

  const getStatistics = async () => {
    try {
      setLoading(true);

      const res =
        await AchievementService.getStatistics();

      if (res.success) {
        setStatistics(res);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
          "Failed to load statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Get Achievements
  // ==========================================

  const getAchievements = async (
    params = {}
  ) => {
    try {
      setLoading(true);

      const res =
        await AchievementService.getAchievements(
          params
        );

      if (res.success) {
        setAchievements(
          res.achievements || []
        );

        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          count: res.count,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load achievements."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Get Achievement By Id
  // ==========================================

  const getAchievementById =
    async (id) => {
      try {
        setLoading(true);

        const res =
          await AchievementService.getAchievementById(
            id
          );

        if (res.success) {
          setAchievement(
            res.achievement
          );
          setStatistics(
            res.statistics || {}
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load achievement."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // Create
  // ==========================================

  const createAchievement =
    async (formData) => {
      try {
        setLoading(true);

        const res =
          await AchievementService.createAchievement(
            formData
          );

        if (res.success) {
          toast.success(
            res.message
          );

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to create achievement."
        );

        return false;
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // Update
  // ==========================================

  const updateAchievement =
    async (id, formData) => {
      try {
        setLoading(true);

        const res =
          await AchievementService.updateAchievement(
            id,
            formData
          );

        if (res.success) {
          toast.success(
            res.message
          );

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to update achievement."
        );

        return false;
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // Delete
  // ==========================================

  const deleteAchievement =
    async (id) => {
      try {
        setLoading(true);

        const res =
          await AchievementService.deleteAchievement(
            id
          );

        if (res.success) {
          toast.success(
            res.message
          );

          setAchievements(
            (prev) =>
              prev.filter(
                (item) =>
                  item._id !== id
              )
          );

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete achievement."
        );

        return false;
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // Toggle Status
  // ==========================================

  const toggleStatus =
    async (id) => {
      try {
        const res =
          await AchievementService.toggleAchievementStatus(
            id
          );

        if (res.success) {
          toast.success(
            res.message
          );

          setAchievements(
            (prev) =>
              prev.map((item) =>
                item._id === id
                  ? {
                      ...item,
                      isActive:
                        !item.isActive,
                    }
                  : item
              )
          );

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to update status."
        );

        return false;
      }
    };

  // ==========================================
  // Get Badges
  // ==========================================

  const getBadges = async () => {
    try {
      const res =
        await AchievementService.getBadges();

      return (
        res.badges || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load badges."
      );

      return [];
    }
  };

  return {
    loading,

    dashboard,

    statistics,

    totalEarned: statistics?.totalEarned || 0,

    achievements,

    achievement,

    pagination,

    getDashboard,

    getStatistics,

    getAchievements,

    getAchievementById,

    createAchievement,

    updateAchievement,

    deleteAchievement,

    toggleStatus,

    getBadges,
  };
};

export default useAchievement;