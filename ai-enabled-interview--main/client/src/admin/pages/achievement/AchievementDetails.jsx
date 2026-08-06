import { useEffect } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaBullseye,
  FaCalendarAlt,
  FaCoins,
  FaTag,
  FaTrophy,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";

import useAchievement from "../../../admin/hooks/useAchievement";

const AchievementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    achievement,
    totalEarned,
    getAchievementById,
    deleteAchievement,
  } = useAchievement();

  useEffect(() => {
    getAchievementById(id);
  }, [id]);

  if (loading || !achievement) {
    return (
      <div className="flex justify-center items-center py-28">
        <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate("/admin/achievement")}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-amber-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Achievements
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-500/30 animate-bounce">
              <FaTrophy />
            </div>
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Achievement Details
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Detailed breakdown, milestone criteria, and live engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/achievement/edit/${achievement._id}`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:via-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <FaEdit /> Edit Achievement
          </Link>
        </div>
      </div>

      {/* 2. MAIN HERO CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-8">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

        {/* Hero Title & Avatar */}
        <div className="flex items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-xl shadow-rose-500/20 shrink-0">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <FaTrophy className="text-4xl text-amber-500 drop-shadow-md" />
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {achievement.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  achievement.isActive
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-rose-100 text-rose-700 border border-rose-300"
                }`}
              >
                {achievement.isActive ? (
                  <>
                    <FaCheckCircle /> Active
                  </>
                ) : (
                  <>
                    <FaTimesCircle /> Inactive
                  </>
                )}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* 3. KEY METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Category */}
          <div className="bg-gradient-to-br from-cyan-50/90 via-blue-50/40 to-white border border-cyan-200/90 hover:border-cyan-400 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-cyan-700/80">
                Category
              </p>
              <h3 className="text-lg font-black text-slate-900 capitalize mt-1">
                {achievement.category}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <FaTag />
            </div>
          </div>

          {/* Target */}
          <div className="bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white border border-rose-200/90 hover:border-rose-400 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-rose-700/80">
                Target Milestone
              </p>
              <h3 className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mt-1">
                {achievement.target}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <FaBullseye />
            </div>
          </div>

          {/* Reward XP */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border border-amber-200/90 hover:border-amber-400 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-700/80">
                Reward XP
              </p>
              <h3 className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
                +{achievement.rewardPoints} XP
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <FaCoins />
            </div>
          </div>
        </div>

        {/* 4. LINKED BADGE & STATISTICS */}
        <div className="grid lg:grid-cols-2 gap-6 pt-4">
          {/* Linked Badge */}
          <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-white rounded-2xl border border-purple-200/90 hover:border-purple-400 p-6 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <h3 className="text-base font-black text-purple-900 flex items-center gap-2">
              <FaAward className="text-purple-600 group-hover:scale-110 transition-transform" /> Linked Badge
            </h3>

            {achievement.badge ? (
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-purple-100 shadow-sm group-hover:border-purple-200 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shrink-0 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                    {achievement.badge.icon ? (
                      <img
                        src={achievement.badge.icon}
                        alt={achievement.badge.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaAward className="text-2xl text-purple-600" />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                    {achievement.badge.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">
                    {achievement.badge.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-500 bg-white p-4 rounded-xl border border-purple-100 text-center">
                No linked badge assigned to this achievement.
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-6 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FaUsers className="text-indigo-600 group-hover:scale-110 transition-transform" /> Engagement Statistics
            </h3>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Users Unlocked:</span>
                <span className="text-base font-black text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                  {totalEarned || 0} Learners
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-slate-400" /> Created On:
                </span>
                <span className="text-slate-800 font-bold">
                  {new Date(achievement.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-slate-400" /> Last Updated:
                </span>
                <span className="text-slate-800 font-bold">
                  {new Date(achievement.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. FOOTER ACTIONS */}
        <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-100">
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this achievement?"
              );
              if (!confirmed) return;
              const success = await deleteAchievement(achievement._id);
              if (success) {
                navigate("/admin/achievement");
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <FaTrash /> Delete Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetails;