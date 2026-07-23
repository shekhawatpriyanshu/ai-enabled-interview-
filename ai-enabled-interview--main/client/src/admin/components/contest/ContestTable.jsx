import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ContestTable = ({
  contests = [],
  loading = false,
  onDelete,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Live":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Completed":
        return "bg-slate-50 text-slate-700 border border-slate-200";
      case "Draft":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">
          Loading contests...
        </p>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">
          No contests found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Title</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Problems</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Duration</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Start</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">End</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contests.map((contest) => (
            <tr key={contest._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-left">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{contest.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{contest.description}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{contest.problems?.length || 0}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{contest.duration} min</td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(contest.status)}`}>
                  {contest.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{new Date(contest.startTime).toLocaleString()}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{new Date(contest.endTime).toLocaleString()}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/contests/${contest._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/contests/edit/${contest._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => onDelete(contest)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Delete"
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