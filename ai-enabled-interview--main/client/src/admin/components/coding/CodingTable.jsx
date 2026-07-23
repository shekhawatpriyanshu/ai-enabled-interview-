import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
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

  // ============================
  // Loading State
  // ============================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading Coding Problems...
        </p>
      </div>
    );
  }

  // ============================
  // Empty State
  // ============================

  if (!problems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
        <p className="text-slate-500 font-medium">No Coding Problems Found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[70px]">
              #
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Title
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Topic
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[120px]">
              Difficulty
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[150px]">
              Created
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[180px] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {problems.map((problem, index) => (
            <tr
              key={problem._id}
              className="hover:bg-slate-50/80 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                {problem.title}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {problem.topic}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    problem.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : problem.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusToggle
                  id={problem._id}
                  status={problem.status}
                  onToggle={onToggleStatus}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(problem.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  {/* View */}
                  <button
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="View"
                    onClick={() => navigate(`/admin/coding/${problem._id}`)}
                  >
                    <FaEye />
                  </button>

                  {/* Edit */}
                  <button
                    className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Edit"
                    onClick={() =>
                      navigate(`/admin/coding/edit/${problem._id}`)
                    }
                  >
                    <FaEdit />
                  </button>

                  {/* Delete */}
                  <button
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Delete"
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