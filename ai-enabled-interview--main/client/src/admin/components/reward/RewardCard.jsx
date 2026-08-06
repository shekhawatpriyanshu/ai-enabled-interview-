import React from "react";
import { FaUser, FaTrophy, FaAward, FaCoins } from "react-icons/fa";

const RewardCard = ({ reward }) => {
  if (!reward) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
          {reward.user?.name ? reward.user.name.charAt(0) : <FaUser />}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
            {reward.user?.name || "N/A"}
          </h3>
          <p className="text-xs text-slate-500 truncate">{reward.user?.email || "No email"}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
            <FaTrophy className="text-orange-500 text-[10px]" />
          </div>
          <span className="truncate">{reward.achievement?.title || "N/A"}</span>
        </div>

        {reward.badge && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <div className="w-6 h-6 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-100 shrink-0">
              <FaAward className="text-yellow-500 text-[10px]" />
            </div>
            <span className="truncate">{reward.badge.title}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] font-medium text-slate-400">
            {new Date(reward.createdAt).toLocaleDateString()}
          </span>
          <span className="inline-block whitespace-nowrap px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shadow-sm group-hover:scale-105 transition-transform">
            +{reward.rewardPoints || 0} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;