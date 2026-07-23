import React from "react";
import {
  FaTrophy,
  FaMedal,
  FaCoins,
  FaBullseye,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AchievementCard = ({
  achievement,
}) => {
  if (!achievement) return null;

  const categoryColors = {
    coding:
      "bg-blue-100 text-blue-700 border-blue-200",

    questions:
      "bg-purple-100 text-purple-700 border-purple-200",

    interviews:
      "bg-cyan-100 text-cyan-700 border-cyan-200",

    tests:
      "bg-green-100 text-green-700 border-green-200",

    contests:
      "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 px-6 py-5 text-white">

        <div className="flex justify-between items-start">

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">

              {achievement.badge?.icon ? (
                <img
                  src={achievement.badge.icon}
                  alt={achievement.badge.title}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <FaTrophy className="text-2xl" />
              )}

            </div>

            <div>

              <h2 className="text-lg font-bold">
                {achievement.title}
              </h2>

              <p className="text-sm text-yellow-100">
                Achievement
              </p>

            </div>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              achievement.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {achievement.isActive
              ? "Active"
              : "Inactive"}
          </span>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        <p className="text-slate-600 text-sm leading-6 min-h-[60px]">
          {achievement.description}
        </p>

        {/* Category */}

        <div className="mt-5">

          <span
            className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${
              categoryColors[
                achievement.category
              ] ||
              "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {achievement.category}
          </span>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="text-center">

            <FaBullseye className="mx-auto text-blue-500 text-lg" />

            <p className="text-xs text-slate-500 mt-2">
              Target
            </p>

            <p className="font-bold">
              {achievement.target}
            </p>

          </div>

          <div className="text-center">

            <FaCoins className="mx-auto text-amber-500 text-lg" />

            <p className="text-xs text-slate-500 mt-2">
              Reward
            </p>

            <p className="font-bold">
              {achievement.rewardPoints}
            </p>

          </div>

          <div className="text-center">

            <FaMedal className="mx-auto text-purple-500 text-lg" />

            <p className="text-xs text-slate-500 mt-2">
              Badge
            </p>

            <p className="font-bold truncate">
              {achievement.badge?.title ||
                "-"}
            </p>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-slate-200 px-6 py-4 flex justify-between">

        <Link
          to={`/admin/achievement/${achievement._id}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <FaEye />

          View
        </Link>

        <Link
          to={`/admin/achievement/edit/${achievement._id}`}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <FaEdit />

          Edit
        </Link>

      </div>

    </div>
  );
};

export default AchievementCard;