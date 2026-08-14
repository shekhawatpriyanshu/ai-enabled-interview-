import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MockTestTable = ({
  tests = [],
  loading = false,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading mock tests...
      </div>
    );
  }

  if (!tests.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No mock tests found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Title</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Questions</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Duration</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Difficulty</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Marks</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Created By</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {tests.map((test) => (
            <tr
              key={test._id}
              className="hover:bg-slate-50/80 transition-colors"
            >
              <td className="px-6 py-4 font-semibold text-sm text-slate-900 text-left">
                {test.title}
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus && onToggleStatus(test._id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                    test.isActive !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                  }`}
                  title="Click to toggle Active / Inactive status"
                >
                  {test.isActive !== false ? (
                    <>
                      <FaCheckCircle className="text-emerald-500 w-3 h-3" /> Active
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-slate-400 w-3 h-3" /> Inactive
                    </>
                  )}
                </button>
              </td>

              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {test.questions?.length || 0}
              </td>

              <td className="px-6 py-4 text-center text-sm text-slate-600">
                <div className="flex justify-center items-center gap-1">
                  <FaClock className="text-xs" />
                  {test.duration} min
                </div>
              </td>

              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                  ${test.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : test.difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                >
                  {test.difficulty}
                </span>
              </td>

              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {test.totalMarks}
              </td>

              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {test.createdBy?.name || "-"}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/mock-tests/${test._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="View"
                  >
                    <FaEye />
                  </Link>

                  <Link
                    to={`/admin/mock-tests/edit/${test._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>

                  <button
                    onClick={() => onDelete(test)}
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

export default MockTestTable;