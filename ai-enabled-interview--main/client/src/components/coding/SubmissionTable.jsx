import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCode,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

const SubmissionTable = ({ submissions }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <FaCheckCircle className="text-emerald-600 text-xs" />
            <span>Accepted</span>
          </span>
        );
      case "Wrong Answer":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <FaTimesCircle className="text-rose-600 text-xs" />
            <span>Wrong Answer</span>
          </span>
        );
      case "Runtime Error":
      case "Compilation Error":
      case "Time Limit Exceeded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <FaExclamationTriangle className="text-amber-600 text-xs" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
            <span>{status || "Submitted"}</span>
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            Easy
          </span>
        );
      case "Medium":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            Medium
          </span>
        );
      case "Hard":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            Hard
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600">
            {difficulty || "Normal"}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider border-b border-slate-800">
              <th className="px-6 py-4">Problem</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Submitted On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-indigo-50/40 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {submission.problem?.title || submission.title || "Coding Problem"}
                </td>

                <td className="px-6 py-4">
                  {getDifficultyBadge(submission.problem?.difficulty || submission.difficulty)}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase">
                    <FaCode className="text-indigo-500 text-xs" />
                    <span>{submission.language || "javascript"}</span>
                  </span>
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(submission.status)}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 font-black text-slate-900">
                    <FaTrophy className="text-amber-500 text-xs" />
                    <span>{submission.score !== undefined ? submission.score : 100}</span>
                  </span>
                </td>

                <td className="px-6 py-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-slate-400 text-xs" />
                    <span>
                      {submission.createdAt
                        ? format(new Date(submission.createdAt), "dd MMM yyyy, hh:mm a")
                        : "Recently"}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;