import { FaCode, FaCheckCircle, FaChartLine } from "react-icons/fa";

const CodingStats = ({ codingStats }) => {
  if (!codingStats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
        Coding Problem Stats
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submissions</span>
            <div className="p-2.5 rounded-2xl bg-violet-500/20 text-violet-400">
              <FaCode className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{codingStats.totalSubmissions || 0}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Total Problems Attempted</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <FaCheckCircle className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">{codingStats.acceptedSubmissions || 0}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Successfully Solved</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy Rate</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <FaChartLine className="text-base" />
            </div>
          </div>
          <p className="text-3xl font-black text-cyan-400">{codingStats.accuracyRate || 0}%</p>
          <span className="text-[10px] text-slate-400 font-semibold">Acceptance Rate</span>
        </div>
      </div>
    </div>
  );
};

export default CodingStats;
