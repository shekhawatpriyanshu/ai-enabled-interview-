// src/pages/analytics/Achievements.jsx

import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import AchievementCard from "../../components/analytics/AchievementCard";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";

import useAnalytics from "../../hooks/useAnalytics";

import {
  getAchievements,
} from "../../services/AnalyticsService";

const Achievements = () => {
  const { analytics } = useAnalytics();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const res = await getAchievements();

      if (res.success) {
        setAchievements(res.achievements);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const getProgress = (category) => {
    switch (category) {
      case "questions":
        return analytics?.questionsSolved || 0;

      case "coding":
        return analytics?.codingSolved || 0;

      case "tests":
        return analytics?.testsCompleted || 0;

      case "contests":
        return analytics?.contestsParticipated || 0;

      case "interviews":
        return analytics?.interviewsCompleted || 0;

      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <AnalyticsSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-2 space-y-6">

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              🏆 Achievements
            </h2>

            <p className="text-slate-500 mb-0 mt-1">
              Unlock achievements by completing milestones.
            </p>

          </div>

          <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
            {achievements.length} Achievements
          </span>

        </div>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

            <h4 className="text-lg font-bold text-slate-700">No Achievements Found</h4>

            <p className="text-slate-500 mt-2">
              No achievements have been created yet.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement._id}
                achievement={achievement}
                progress={getProgress(
                  achievement.category
                )}
              />
            ))}

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Achievements;