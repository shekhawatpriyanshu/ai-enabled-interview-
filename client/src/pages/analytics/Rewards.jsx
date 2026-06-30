// src/pages/analytics/Rewards.jsx

import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import RewardCard from "../../components/analytics/RewardCard";
import RewardTimeline from "../../components/analytics/RewardTimeline";
import EmptyRewards from "../../components/analytics/EmptyRewards";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";

import { getMyRewards } from "../../services/AnalyticsService";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = async () => {
    try {
      const res = await getMyRewards();

      if (res.success) {
        setRewards(res.rewards);
      }
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

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

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              🎁 My Rewards
            </h2>

            <p className="text-slate-500 mb-0 mt-1">
              View all badges and achievements you've earned.
            </p>
          </div>

          <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-200">
            {rewards.length} Rewards
          </span>

        </div>

        {rewards.length === 0 ? (
          <EmptyRewards />
        ) : (
          <div className="space-y-8">
            {/* Reward Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {rewards.map((reward) => (
                <RewardCard key={reward._id} reward={reward} />
              ))}

            </div>

            {/* Timeline */}
            <RewardTimeline rewards={rewards} />
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Rewards;