import { Trophy, Medal, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardTable = ({ leaderboard = [] }) => {
  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-3">
        <Trophy size={48} className="mx-auto text-amber-400 animate-bounce" />
        <h2 className="text-xl font-black text-slate-900">No Leaderboard Yet</h2>
        <p className="text-slate-500 text-xs font-semibold">
          Once participants submit solutions, live rankings will appear here.
        </p>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 font-black">
            <Trophy size={18} />
          </span>
        );
      case 2:
        return (
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-400 text-white flex items-center justify-center shadow-md font-black">
            <Medal size={18} />
          </span>
        );
      case 3:
        return (
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-md font-black">
            <Award size={18} />
          </span>
        );
      default:
        return (
          <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Trophy className="text-amber-500" size={22} />
          <span>Contest Leaderboard</span>
        </h2>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Rankings Updated Live
        </span>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider border-b border-slate-800">
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Participant</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold">
            {leaderboard.map((item, index) => {
              const rank = item.rank || index + 1;

              return (
                <motion.tr
                  key={item._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="hover:bg-indigo-50/40 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4">{getRankBadge(rank)}</td>

                  <td className="px-6 py-4 font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.user?.name || "Participant"}
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {item.user?.email || "—"}
                  </td>

                  <td className="px-6 py-4 text-center font-black text-indigo-600 text-base">
                    {item.score || 0}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;