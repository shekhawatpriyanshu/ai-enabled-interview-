import React from "react";
import { FaUser, FaTrophy, FaAward, FaCoins, FaCalendarAlt, FaStar } from "react-icons/fa";

const RewardCard = ({ reward }) => {
  if (!reward) return null;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between space-y-4">
      {/* Top Accent Bar matching primary admin palette */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 group-hover:h-2 transition-all duration-300" />

      {/* User Info Header */}
      <div className="flex items-center gap-3.5 pt-1">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm uppercase shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {reward.user?.name ? getInitials(reward.user.name) : <FaUser className="text-sm" />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
            {reward.user?.name || "Anonymous User"}
          </h3>
          <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">
            {reward.user?.email || "No email available"}
          </p>
        </div>
      </div>

      {/* Reward Details Section */}
      <div className="border-t border-slate-100/90 pt-4 space-y-3">
        {/* Achievement */}
        {reward.achievement?.title && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs font-bold text-amber-800 shadow-inner">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FaTrophy className="text-xs" />
            </div>
            <span className="truncate">{reward.achievement.title}</span>
          </div>
        )}

        {/* Badge */}
        {reward.badge?.title && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-50/80 border border-purple-200/80 text-xs font-bold text-purple-800 shadow-inner">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FaAward className="text-xs" />
            </div>
            <span className="truncate">{reward.badge.title}</span>
          </div>
        )}

        {/* Reward Reason / Fallback title */}
        {!reward.achievement?.title && !reward.badge?.title && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs font-bold text-indigo-800 shadow-inner">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FaStar className="text-xs" />
            </div>
            <span className="truncate">{reward.reason || "Manual Reward Granted"}</span>
          </div>
        )}

        {/* Footer Info: Timestamp & XP Pill */}
        <div className="flex justify-between items-center pt-2 ">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <FaCalendarAlt className="text-slate-300 text-xs" />
            {new Date(reward.createdAt || reward.earnedAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-black shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
            <FaCoins className="text-amber-300 text-xs animate-bounce" />
            +{reward.rewardPoints || 0} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;