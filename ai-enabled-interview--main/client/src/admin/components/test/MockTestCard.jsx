import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaClock,
  FaQuestionCircle,
  FaTrophy,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaBookOpen,
} from "react-icons/fa";

const MockTestCard = ({ test, onDelete }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 group-hover:h-2 transition-all duration-300" />

      {/* Header Section: Badges & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(
                test.difficulty
              )}`}
            >
              {test.difficulty || "Easy"}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${test.isActive !== false
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
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
            </span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-inner group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <FaBookOpen />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {test.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed min-h-[36px]">
          {test.description || "No description provided for this mock test."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6">
          {/* Questions */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mb-0.5">
              <FaQuestionCircle className="text-indigo-500 text-xs" /> Questions
            </span>
            <span className="text-sm font-bold text-slate-800">
              {test.questions?.length || 0}
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center text-center border-x border-slate-200/60">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mb-0.5">
              <FaClock className="text-cyan-500 text-xs" /> Duration
            </span>
            <span className="text-sm font-bold text-slate-800">
              {test.duration || 0}m
            </span>
          </div>

          {/* Marks */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mb-0.5">
              <FaTrophy className="text-amber-500 text-xs" /> Marks
            </span>
            <span className="text-sm font-bold text-slate-800">
              {test.totalMarks || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Section: Author & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
            <FaUser className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
            {test.createdBy?.name || "Admin"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to={`/admin/mock-tests/${test._id}`}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 active:scale-95"
            title="View Details"
          >
            <FaEye className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={`/admin/mock-tests/edit/${test._id}`}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-amber-500/20 active:scale-95"
            title="Edit Test"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => onDelete(test)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-rose-500/20 active:scale-95 cursor-pointer"
            title="Delete Test"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockTestCard;
