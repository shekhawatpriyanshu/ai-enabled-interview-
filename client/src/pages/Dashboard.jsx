import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getMyAnalytics, getMyRewards } from "../services/AnalyticsService";

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

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back to your AI Interview Preparation Platform 🚀
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Total Interviews
          </h3>

          <p className="text-4xl font-bold mt-3 text-cyan-600">
            {totalInterviews}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Questions Solved
          </h3>

          <p className="text-4xl font-bold mt-3 text-purple-600">
            {questionsSolved}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Achievements
          </h3>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {achievementsCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Score
          </h3>

          <p className="text-4xl font-bold mt-3 text-orange-600">
            {totalScore}
          </p>
        </div>

      </div>

    </MainLayout>
  );
};

export default Dashboard;