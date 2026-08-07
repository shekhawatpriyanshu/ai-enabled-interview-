import { Calendar, Clock3, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const statusStyles = {
  Live: "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse shadow-xs",
  Upcoming: "bg-amber-100 text-amber-800 border-amber-300 shadow-xs",
  Completed: "bg-indigo-100 text-indigo-800 border-indigo-300 shadow-xs",
};

const ContestHeader = ({ contest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10 text-slate-800"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500" />

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles size={14} className="text-indigo-600 animate-pulse" />
            <span>Coding Contest Overview</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Trophy size={26} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {contest.title}
            </h1>
          </div>

          <p className="text-slate-600 text-sm font-semibold max-w-2xl leading-relaxed pt-1">
            {contest.description || "Participate in this coding contest challenge to test algorithm speed and rank on leaderboards."}
          </p>
        </div>

        <div className="shrink-0">
          <span
            className={`inline-flex px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider ${
              statusStyles[contest.status] || statusStyles.Completed
            }`}
          >
            {contest.status || "Completed"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-6" />

      {/* Contest Timings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="flex items-center gap-3 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Start Time</p>
            <p className="font-black text-xs text-slate-900 mt-0.5">
              {new Date(contest.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">End Time</p>
            <p className="font-black text-xs text-slate-900 mt-0.5">
              {new Date(contest.endTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock3 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Duration</p>
            <p className="font-black text-xs text-slate-900 mt-0.5">
              {contest.duration} Minutes
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestHeader;