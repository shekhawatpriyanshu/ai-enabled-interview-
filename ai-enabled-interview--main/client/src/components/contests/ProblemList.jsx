import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileCode2, ExternalLink, ArrowRight, Tag } from "lucide-react";

const difficultyBadgeStyles = {
  Easy: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  Hard: "bg-rose-100 text-rose-800 border-rose-300",
};

const ProblemList = ({ problems = [] }) => {
  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-3">
        <FileCode2 className="mx-auto text-slate-300 animate-bounce" size={48} />
        <h2 className="text-xl font-black text-slate-900">No Problems Available</h2>
        <p className="text-slate-500 text-xs font-semibold">
          This contest doesn't contain any coding problems yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileCode2 className="text-indigo-600" size={22} />
          <span>Contest Challenges ({problems.length})</span>
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Solve to Rank
        </span>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider border-b border-slate-800">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Problem Challenge</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold">
            {problems.map((problem, index) => {
              const letter = String.fromCharCode(65 + index);
              const badgeStyle = difficultyBadgeStyles[problem.difficulty] || "bg-slate-100 text-slate-700 border-slate-200";

              return (
                <motion.tr
                  key={problem._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-indigo-50/40 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 font-black text-indigo-600 text-base">
                    {letter}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
                      {problem.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {problem.description || "Solve this algorithmic challenge to earn contest points."}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${badgeStyle}`}>
                      {problem.difficulty || "Easy"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/coding/${problem._id}`}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 hover:scale-105 transition-all uppercase tracking-wider"
                    >
                      <span>Solve</span>
                      <ExternalLink size={14} />
                    </Link>
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

export default ProblemList;