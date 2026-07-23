import { useEffect } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaBullseye,
  FaCalendarAlt,
  FaCoins,
  FaTag,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import useAchievement from "../../../admin/hooks/useAchievement";

const AchievementDetails = () => {
  const { id } = useParams();

  const {
    loading,
    achievement,
    totalEarned,
    getAchievementById,
  } = useAchievement();

  useEffect(() => {
    getAchievementById(id);
  }, [id]);

  if (loading || !achievement) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ============================
            Header
      ============================ */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Achievement Details
          </h1>

          <p className="text-slate-500 mt-2">
            View complete achievement information.
          </p>
        </div>

        <Link
          to="/admin/achievement"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* ============================
            Main Card
      ============================ */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <FaAward className="text-yellow-500 text-3xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {achievement.title}
            </h2>

            <p className="text-slate-500 mt-1">
              {achievement.description}
            </p>
          </div>

        </div>

        {/* ======================
              Information Grid
        ======================= */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Category */}

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FaTag className="text-blue-500" />
              <span className="font-semibold">
                Category
              </span>
            </div>

            <p className="capitalize text-slate-700">
              {achievement.category}
            </p>
          </div>

          {/* Target */}

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FaBullseye className="text-green-600" />
              <span className="font-semibold">
                Target
              </span>
            </div>

            <p className="text-xl font-bold">
              {achievement.target}
            </p>
          </div>

          {/* Reward */}

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FaCoins className="text-amber-500" />
              <span className="font-semibold">
                Reward
              </span>
            </div>

            <p className="text-xl font-bold">
              {achievement.rewardPoints} XP
            </p>
          </div>

        </div>
                {/* ======================
              Badge & Statistics
        ======================= */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Badge */}

          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-5">
              Badge Information
            </h3>

            {achievement.badge ? (
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                  {achievement.badge.icon ? (
                    <img
                      src={achievement.badge.icon}
                      alt={achievement.badge.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaAward className="text-yellow-500 text-3xl" />
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold">
                    {achievement.badge.title}
                  </h4>

                  <p className="text-slate-500 mt-1">
                    {achievement.badge.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-500">
                No badge is assigned to this achievement.
              </div>
            )}
          </div>

          {/* Statistics */}

          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-5">
              Achievement Statistics
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Users Earned
                </span>

                <span className="font-semibold">
                  {totalEarned || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Status
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Created
                </span>

                <span>
                  {new Date(
                    achievement.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Updated
                </span>

                <span>
                  {new Date(
                    achievement.updatedAt
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ======================
              Actions
        ======================= */}

        <div className="flex justify-end gap-3 mt-8 border-t border-slate-200 pt-6">

          <Link
            to={`/admin/achievement/edit/${achievement._id}`}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Edit Achievement
          </Link>

          <button
            onClick={async () => {
              const confirmed =
                window.confirm(
                  "Are you sure you want to delete this achievement?"
                );

              if (!confirmed) return;

              const success =
                await deleteAchievement(
                  achievement._id
                );

              if (success) {
                window.history.back();
              }
            }}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default AchievementDetails;