import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getMyAnalytics, getMyRewards } from "../services/AnalyticsService";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, rewardsRes] = await Promise.all([
          getMyAnalytics(),
          getMyRewards(),
        ]);
        if (analyticsRes.success) {
          setAnalytics(analyticsRes.analytics);
        }
        if (rewardsRes.success) {
          setRewards(rewardsRes.rewards);
        }
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout showNavbar={true}>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  const totalInterviews = analytics?.interviewsCompleted || 0;
  const questionsSolved = analytics?.questionsSolved || 0;
  const achievementsCount = rewards.filter((r) => r.achievement).length;
  const totalScore = analytics?.totalScore || 0;

  return (
    <MainLayout showNavbar={true}>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back to LeetChef 🚀
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer"
        >
          <h3 className="text-slate-500 font-medium">
            Total Interviews
          </h3>

          <p className="text-4xl font-bold mt-3 text-cyan-600">
            {totalInterviews}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer"
        >
          <h3 className="text-slate-500 font-medium">
            Questions Solved
          </h3>

          <p className="text-4xl font-bold mt-3 text-purple-600">
            {questionsSolved}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer"
        >
          <h3 className="text-slate-500 font-medium">
            Achievements
          </h3>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {achievementsCount}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all cursor-pointer"
        >
          <h3 className="text-slate-500 font-medium">
            Score
          </h3>

          <p className="text-4xl font-bold mt-3 text-orange-600">
            {totalScore}
          </p>
        </motion.div>

      </div>

    </MainLayout>
  );
};

export default Dashboard;