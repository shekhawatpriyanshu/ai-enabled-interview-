import React from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaTrophy,
  FaAward,
  FaCoins,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import StatusToggle from "../coding/StatusToggle";

const AchievementTable = ({
  achievements = [],
  currentPage = 1,
  pageSize = 10,
  onDelete,
  onToggleStatus,
  loading = false,
}) => {
  const navigate = useNavigate();

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Achievements...
        </p>
      </div>
    );
  }

  // ===========================
  // Empty
  // ===========================

  if (!achievements.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <FaTrophy />
        </div>
        <h3 className="text-lg font-black text-slate-900">
          No Achievements Found
        </h3>
        <p className="text-slate-500 text-xs mt-1 font-semibold">
          Create your first achievement using the button above.
        </p>
      </div>
    );
  }

  const badgeColor = (category) => {
    switch (category) {
      case "coding":
        return "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-300/80";
      case "questions":
        return "bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700 border-purple-300/80";
      case "tests":
        return "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-300/80";
      case "contests":
        return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300/80";
      case "interviews":
        return "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-300/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-16">
              #
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Achievement
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Target
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Reward
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Badge
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Created
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[160px]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {achievements.map((achievement, index) => (
            <tr
              key={achievement._id}
              className="hover:bg-gradient-to-r hover:from-amber-50/60 hover:via-rose-50/30 hover:to-purple-50/40 transition-all duration-300 group"
            >
              <td className="px-6 py-4 text-xs font-bold text-slate-400 text-left">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    <FaTrophy />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black capitalize tracking-wide border shadow-sm ${badgeColor(
                    achievement.category
                  )}`}
                >
                  {achievement.category}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-black text-sm text-slate-900">
                {achievement.target}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold">
                  <FaCoins className="text-amber-500 text-xs" />
                  +{achievement.rewardPoints ?? 0} XP
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {achievement.badge ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold truncate max-w-[120px]">
                    <FaAward className="text-purple-500 shrink-0" />
                    {achievement.badge.title}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <StatusToggle
                  id={achievement._id}
                  status={achievement.isActive}
                  onToggle={onToggleStatus}
                />
              </td>
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(achievement.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/admin/achievement/${achievement._id}`)}
                    className="w-8.5 h-8.5 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/achievement/edit/${achievement._id}`)}
                    className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Edit Achievement"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(achievement)}
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Delete Achievement"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AchievementTable;