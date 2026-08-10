import { FaMicrophone, FaTrophy, FaStar } from "react-icons/fa";

const InterviewStats = ({ interviewStats }) => {
  if (!interviewStats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        AI Interview Performance
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <FaMicrophone className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{interviewStats.totalInterviews || 0}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Sessions Completed</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <FaStar className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-400">{interviewStats.averageScore || 0}%</p>
          <span className="text-[10px] text-slate-400 font-semibold">Overall Technical Rating</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Best Score</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <FaTrophy className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400">{interviewStats.bestScore || 0}%</p>
          <span className="text-[10px] text-slate-400 font-semibold">Peak Performance Score</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewStats;
