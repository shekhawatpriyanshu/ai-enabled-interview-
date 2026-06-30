// src/pages/analytics/AnalyticsDashboard.jsx

import MainLayout from "../../layouts/MainLayout";
import useAnalytics from "../../hooks/useAnalytics";

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
      <MainLayout>
        <AnalyticsSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-2 space-y-8">

        {/* Header */}
        <AnalyticsHeader analytics={analytics} />

        {/* Statistics */}
        <AnalyticsStats analytics={analytics} />

        {/* Charts & Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

          {/* Progress */}
          <div className="space-y-4 lg:col-span-1">
            <ProgressCard
              title="Questions Solved"
              value={analytics?.questionsSolved || 0}
              target={100}
              color="blue"
            />

            <ProgressCard
              title="Coding Solved"
              value={analytics?.codingSolved || 0}
              target={100}
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
          </div>

          {/* Activity Chart */}
          <div className="lg:col-span-2">
            <ActivityChart analytics={analytics} />
          </div>

        </div>

        {/* Recent Rewards */}
        <div className="mt-8">

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              🏆 Recent Rewards
            </h3>

            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
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

        </div>

      </div>
    </MainLayout>
  );
};

export default AnalyticsDashboard;