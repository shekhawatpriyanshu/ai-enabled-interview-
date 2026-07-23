import React from "react";
import { FaUser, FaTrophy, FaAward, FaCoins } from "react-icons/fa";

const RewardCard = ({ reward }) => {
  if (!reward) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <FaUser />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">
            {reward.user?.name || "N/A"}
          </h3>
          <p className="text-xs text-slate-500">{reward.user?.email || "No email"}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FaTrophy className="text-orange-500" />
          <span className="font-medium text-slate-800">
            {reward.achievement?.title || "N/A"}
          </span>
        </div>

        {reward.badge && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaAward className="text-yellow-500" />
            <span>{reward.badge.title}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400">
            {new Date(reward.createdAt).toLocaleDateString()}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
            +{reward.rewardPoints || 0} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;