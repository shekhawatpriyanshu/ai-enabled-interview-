import React from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaTrophy,
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
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="h-10 w-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>

        <p className="mt-4 text-sm text-slate-500 font-medium">
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
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <FaTrophy className="text-5xl text-yellow-400 mb-3" />

        <h3 className="text-lg font-semibold">
          No Achievements Found
        </h3>

        <p className="text-slate-500 mt-2">
          Create your first achievement.
        </p>
      </div>
    );
  }

  const badgeColor = (category) => {
    switch (category) {
      case "coding":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "questions":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "tests":
        return "bg-green-50 text-green-700 border-green-200";

      case "contests":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "interviews":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left w-16">#</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Achievement</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Category</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Target</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Reward</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Badge</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Created</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {achievements.map(
            (achievement, index) => (
              <tr
                key={achievement._id}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 text-sm text-slate-500 text-left">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 text-left">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{achievement.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{achievement.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor(achievement.category)}`}>
                    {achievement.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-medium text-sm text-slate-900">
                  {achievement.target}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">
                  {achievement.rewardPoints ?? 0} XP
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">
                  {achievement.badge ? achievement.badge.title : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusToggle
                    id={achievement._id}
                    status={achievement.isActive}
                    onToggle={onToggleStatus}
                  />
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">
                  {new Date(achievement.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/achievement/${achievement._id}`)}
                      className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/achievement/edit/${achievement._id}`)}
                      className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(achievement)}
                      className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AchievementTable;