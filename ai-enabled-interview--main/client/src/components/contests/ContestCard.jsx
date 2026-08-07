import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  FileCode2,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const statusStyles = {
  Live: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/15",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse",
    topLine: "from-emerald-400 to-teal-500",
    btnBg: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25",
  },
  Upcoming: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/15",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
    topLine: "from-amber-400 to-orange-500",
    btnBg: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/25",
  },
  Completed: {
    cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/15",
    badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-300",
    topLine: "from-indigo-400 to-purple-500",
    btnBg: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25",
  },
};

const ContestCard = ({ contest, index = 0 }) => {
  const style = statusStyles[contest.status] || statusStyles.Completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`group border rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden text-slate-800 ${style.cardBg}`}
    >
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.topLine}`} />

      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 tracking-tight truncate">
              {contest.title}
            </h2>
            <p className="text-slate-600 text-xs font-semibold line-clamp-2 leading-relaxed">
              {contest.description || "Participate in this coding contest challenge to test algorithm speed and rank on leaderboards."}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shrink-0 shadow-2xs ${style.badgeBg}`}>
            {contest.status || "Upcoming"}
          </span>
        </div>

        {/* 2x2 Information Grid */}
        <div className="grid grid-cols-2 gap-3 relative z-10 pt-1">
          <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Calendar size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Start Date</span>
              <span className="text-xs font-black text-slate-900 truncate block">
                {new Date(contest.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Clock3 size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Duration</span>
              <span className="text-xs font-black text-slate-900 truncate block">
                {contest.duration} mins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
              <FileCode2 size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Problems</span>
              <span className="text-xs font-black text-slate-900 truncate block">
                {contest.problems?.length || 0} Challenges
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Trophy size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Leaderboard</span>
              <span className="text-xs font-black text-slate-900 truncate block">
                Live Rank
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Button */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold text-slate-500">
          Click to view session details
        </span>

        <Link
          to={`/contests/${contest._id}`}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all duration-200 ${style.btnBg}`}
        >
          <span>View Details</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ContestCard;