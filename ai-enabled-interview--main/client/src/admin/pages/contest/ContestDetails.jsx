import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaEdit,
  FaUsers,
  FaTrophy,
  FaClock,
  FaCode,
  FaArrowLeft,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import useContest from "../../hooks/useContest";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { contest, loading, loadContest } = useContest();

  useEffect(() => {
    loadContest(id);
  }, [id]);

  if (loading || !contest) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Contest Details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-purple-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Contests
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
              <FaTrophy />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {contest.title}
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Contest overview, schedule, rules, and problem sets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/admin/contests/edit/${contest._id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FaEdit /> Edit Contest
          </Link>

          <Link
            to={`/admin/contests/${contest._id}/participants`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FaUsers /> Participants
          </Link>

          <Link
            to={`/admin/contests/${contest._id}/leaderboard`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FaTrophy /> Leaderboard
          </Link>
        </div>
      </div>

      {/* 2. CONTEST METRICS & SCHEDULE CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaInfoCircle className="text-indigo-600" /> Contest Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Contest Status</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm mt-1 ${
                contest.status === "Live"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : contest.status === "Upcoming"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {contest.status === "Live" ? "🔥 Live Now" : contest.status === "Upcoming" ? "⏳ Upcoming" : "✅ Completed"}
            </span>
          </div>

          {/* Duration */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Duration</p>
            <div className="flex items-center gap-2 text-slate-900 font-black text-lg mt-0.5">
              <FaClock className="text-amber-500 text-base" /> {contest.duration} Mins
            </div>
          </div>

          {/* Start Time */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Start Date & Time</p>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mt-1.5">
              <FaCalendarAlt className="text-indigo-500 text-xs shrink-0" />
              <span>{new Date(contest.startTime).toLocaleString()}</span>
            </div>
          </div>

          {/* End Time */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">End Date & Time</p>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mt-1.5">
              <FaCalendarAlt className="text-rose-500 text-xs shrink-0" />
              <span>{new Date(contest.endTime).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DESCRIPTION CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500" />
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          Description & Rules
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-line">
          {contest.description || "No specific guidelines provided for this contest."}
        </p>
      </div>

      {/* 4. PROBLEMS CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaCode className="text-teal-600" />
          Coding Problems
          <span className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold px-3 py-0.5 rounded-full shadow-sm">
            {contest.problems?.length || 0}
          </span>
        </h2>

        {!contest.problems || contest.problems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FaCode className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-sm">No Coding Problems Attached</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contest.problems.map((problem, index) => (
              <div
                key={problem._id}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/60 via-teal-50/20 to-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                    {index + 1}. {problem.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Topic: <span className="text-indigo-600 font-black">{problem.topic}</span>
                  </p>
                </div>

                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm shrink-0 ${
                    problem.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : problem.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetails;