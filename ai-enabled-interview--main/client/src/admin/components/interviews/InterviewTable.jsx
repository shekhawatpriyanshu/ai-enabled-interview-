import { FaEye, FaTrash, FaUserTie } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

const InterviewTable = ({
  interviews = [],
  loading,
  onView,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Interview Sessions...
        </p>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 animate-bounce">
          <FaUserTie />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Interviews Found</h3>
        <p className="text-slate-500 text-xs font-medium">
          There are no interview sessions available matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[950px] text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left min-w-[240px]">
              Candidate Profile
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Target Role
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Experience Level
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Questions
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-36">
              Status
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Session Date
            </th>
            <th className="px-6 py-4.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-[140px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {interviews.map((interview) => (
            <tr
              key={interview._id}
              className="hover:bg-gradient-to-r hover:from-cyan-50/60 hover:via-indigo-50/30 hover:to-purple-50/40 transition-all duration-300 group"
            >
              {/* Candidate */}
              <td className="px-6 py-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    {interview.user?.name ? interview.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {interview.user?.name || "Anonymous User"}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal truncate">
                      {interview.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-5 text-xs font-normal text-slate-700">
                <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                  {interview.role || "General Role"}
                </span>
              </td>

              {/* Experience */}
              <td className="px-6 py-5 text-xs font-medium text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  {interview.experienceLevel || "Fresher"}
                </span>
              </td>

              {/* Questions */}
              <td className="px-6 py-5 text-center text-xs font-semibold text-slate-700">
                <span className="w-7 h-7 rounded-lg bg-slate-100 inline-flex items-center justify-center text-slate-700 font-medium">
                  {interview.questions?.length || 0}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-5 text-center">
                <StatusBadge status={interview.status} />
              </td>

              {/* Created */}
              <td className="px-6 py-5 text-center text-xs font-medium text-slate-500">
                {new Date(interview.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onView(interview)}
                    className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    title="View Intelligence Report"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => onDelete(interview)}
                    className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    title="Delete Session"
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

export default InterviewTable;