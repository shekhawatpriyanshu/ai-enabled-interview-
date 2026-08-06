import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaTrophy, FaClock, FaCode } from "react-icons/fa";

const ContestTable = ({ contests = [], loading = false, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Live":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Draft":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Contests...
        </p>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
          <FaTrophy />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Contests Found</h3>
        <p className="text-slate-500 text-xs font-semibold">
          No coding contests match your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[950px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Contest Title
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Problems
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Duration
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Start Date
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              End Date
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[160px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contests.map((contest) => (
            <tr
              key={contest._id}
              className="hover:bg-gradient-to-r hover:from-amber-50/60 hover:via-orange-50/30 hover:to-purple-50/40 transition-all duration-300 group"
            >
              {/* Title & Description */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    <FaTrophy />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {contest.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {contest.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Problems Count */}
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-extrabold shadow-sm">
                  <FaCode className="text-teal-500 text-[10px]" />
                  {contest.problems?.length || 0} Problems
                </span>
              </td>

              {/* Duration */}
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold">
                  <FaClock className="text-indigo-500 text-[10px]" />
                  {contest.duration} Mins
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${getStatusClass(
                    contest.status
                  )}`}
                >
                  {contest.status === "Live" ? "🔥 Live" : contest.status === "Upcoming" ? "⏳ Upcoming" : "✅ Completed"}
                </span>
              </td>

              {/* Start Date */}
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(contest.startTime).toLocaleDateString()}
              </td>

              {/* End Date */}
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(contest.endTime).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-1.5">
                  <Link
                    to={`/admin/contests/${contest._id}`}
                    className="w-8.5 h-8.5 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="View Details"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/contests/edit/${contest._id}`}
                    className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Edit Contest"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => onDelete(contest)}
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Delete Contest"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestTable;