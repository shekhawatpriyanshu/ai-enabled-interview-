import MainLayout from "../../layouts/MainLayout";
import useAnalytics from "../../hooks/useAnalytics";
import { motion } from "framer-motion";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsStats from "../../components/analytics/AnalyticsStats";
import ProgressCard from "../../components/analytics/ProgressCard";
import ActivityChart from "../../components/analytics/ActivityChart";
import RewardCard from "../../components/analytics/RewardCard";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";
import EmptyRewards from "../../components/analytics/EmptyRewards";

const AnalyticsDashboard = () => {
  const { analytics, rewards, loading } = useAnalytics();

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
        <div className="absolute -top-10 left-10 w-96 h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10">
          <AnalyticsHeader analytics={analytics} />
        </div>

        {/* Statistics */}
        <div className="relative z-10">
          <AnalyticsStats analytics={analytics} />
        </div>

        {/* Charts & Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Progress Column */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 lg:col-span-1"
          >
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
              🎯 Goal Progress Metrics
            </h3>

            <ProgressCard
              title="Questions Solved"
              value={analytics?.questionsSolved || 0}
              target={200}
              color="blue"
            />

            <ProgressCard
              title="Coding Solved"
              value={analytics?.codingSolved || 0}
              target={200}
              color="emerald"
            />

            <ProgressCard
              title="Tests Completed"
              value={analytics?.testsCompleted || 0}
              target={50}
              color="amber"
            />

            <ProgressCard
              title="Contests Participated"
              value={analytics?.contestsParticipated || 0}
              target={25}
              color="rose"
            />

            <ProgressCard
              title="Interviews Completed"
              value={analytics?.interviewsCompleted || 0}
              target={20}
              color="cyan"
            />
          </motion.div>

          {/* Activity Chart Column */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <ActivityChart analytics={analytics} />
          </motion.div>
        </div>

        {/* Recent Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative z-10 space-y-4"
        >
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🏆 Recent Unlockable Rewards</span>
            </h3>

            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md shadow-indigo-500/20 uppercase tracking-wider">
              {rewards.length} Earned
            </span>
          </div>

          {rewards.length === 0 ? (
            <EmptyRewards />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward._id}>
                  <RewardCard reward={reward} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsDashboard;