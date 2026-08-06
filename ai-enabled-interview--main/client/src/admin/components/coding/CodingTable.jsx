import React from "react";
import { FaEye, FaEdit, FaTrash, FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import StatusToggle from "./StatusToggle";

const CodingTable = ({
  problems = [],
  currentPage = 1,
  pageSize = 10,
  onDelete,
  onToggleStatus,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-cyan-500/30 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Coding Problems...
        </p>
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30 animate-bounce">
          <FaCode />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Problems Found</h3>
        <p className="text-slate-500 text-xs font-medium">
          No coding challenges match your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">
              #
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Title
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
              Topic Domain
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-left w-32">
              Difficulty
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-36">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Created Date
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-[150px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {problems.map((problem, index) => (
            <tr
              key={problem._id}
              className="hover:bg-gradient-to-r hover:from-cyan-50/60 hover:via-indigo-50/30 hover:to-purple-50/40 transition-all duration-300 group"
            >
              {/* Index */}
              <td className="px-6 py-4 text-xs font-medium text-slate-400">
                {(currentPage - 1) * pageSize + index + 1}
              </td>

              {/* Title */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    <FaCode />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 group-hover:text-cyan-600 transition-colors">
                    {problem.title}
                  </h3>
                </div>
              </td>

              {/* Topic */}
              <td className="px-6 py-4 text-xs font-medium text-slate-700">
                <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 font-medium inline-block">
                  {problem.topic || "General"}
                </span>
              </td>

              {/* Difficulty */}
              <td className="px-6 py-4 text-left">
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${
                    problem.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : problem.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center">
                <StatusToggle
                  id={problem._id}
                  status={problem.status}
                  onToggle={onToggleStatus}
                />
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 text-center text-xs font-medium text-slate-500">
                {new Date(problem.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-1.5">
                  <button
                    className="w-8.5 h-8.5 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    title="View Problem"
                    onClick={() => navigate(`/admin/coding/${problem._id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    title="Edit Problem"
                    onClick={() => navigate(`/admin/coding/edit/${problem._id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    title="Delete Problem"
                    onClick={() => onDelete(problem)}
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

export default CodingTable;