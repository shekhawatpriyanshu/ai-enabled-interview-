import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaPlus, FaArrowRight, FaAward, FaCoins } from "react-icons/fa";

import useReward from "../../hooks/useReward";
import DashboardCards from "../../components/reward/DashboardCards";
import RewardCard from "../../components/reward/RewardCard";

const RewardDashboard = () => {
  const navigate = useNavigate();
  const { dashboard, loading, getDashboard } = useReward();

  useEffect(() => {
    getDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Loading reward metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <FaGift />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Reward Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Manage user rewards, XP points, badges, and achievements across the platform.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/rewards/give")}
          className="group flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-sm self-start sm:self-auto"
        >
          <FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
          Give Manual Reward
        </button>
      </div>

      {/* Statistics Cards */}
      {dashboard && <DashboardCards dashboard={dashboard} />}

      {/* Recent Rewards Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
              <FaAward />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Recent Rewards Activity
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Latest XP points, achievements, and badges granted to users.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/rewards")}
            className="group inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Rewards</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200 text-indigo-500" />
          </button>
        </div>

        {/* Recent Rewards Grid */}
        {dashboard?.recentRewards && dashboard.recentRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.recentRewards.map((item) => (
              <RewardCard key={item._id} reward={item} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-3">
              <FaCoins />
            </div>
            <h3 className="text-base font-bold text-slate-700">
              No Recent Rewards
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Grant manual rewards or users will earn achievements automatically through interview practice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardDashboard;