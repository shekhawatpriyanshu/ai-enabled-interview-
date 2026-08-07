import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaStar } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import AchievementCard from "../../components/analytics/AchievementCard";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";
import useAnalytics from "../../hooks/useAnalytics";
import { getAchievements } from "../../services/AnalyticsService";

const Achievements = () => {
  const { analytics } = useAnalytics();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const res = await getAchievements();
      if (res.success) {
        setAchievements(res.achievements || []);
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
      <MainLayout showNavbar={false}>
        <AnalyticsSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Colorful Ambient Background Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-amber-100/90 via-white to-purple-50/80 border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-amber-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 via-purple-600 to-cyan-500" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <FaTrophy className="text-amber-600 text-xs" />
                <span>Milestone Badges & Trophies</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Platform Achievements
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Unlock achievements and gain platform trophies by completing interview sessions, coding practice, and tests.
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/25 shrink-0">
              <FaMedal />
            </div>
          </div>
        </motion.div>

        {/* Content Body */}
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FaStar className="text-amber-500" />
              <span>Available Milestone Achievements</span>
            </h3>

            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md shadow-amber-500/20 uppercase tracking-wider">
              {achievements.length} Achievements
            </span>
          </div>

          {achievements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-3 max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-xs">
                <FaTrophy className="animate-bounce" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  No Achievements Found
                </h4>
                <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
                  No achievements are currently active. Solve coding problems and practice interviews to unlock upcoming milestones.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                  progress={getProgress(achievement.category)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;