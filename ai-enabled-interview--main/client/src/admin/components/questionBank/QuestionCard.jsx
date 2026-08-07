import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFolder,
  FaBuilding,
  FaUser,
} from "react-icons/fa";

const QuestionCard = ({ question, onDelete }) => {
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

  const getTopBarGradient = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-emerald-500 to-teal-400";
      case "Medium":
        return "from-amber-500 to-orange-400";
      case "Hard":
        return "from-rose-500 to-pink-500";
      default:
        return "from-indigo-500 to-cyan-400";
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getTopBarGradient(
          question.difficulty
        )} group-hover:h-2 transition-all duration-300`}
      />

      <div>
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyBadge(
                question.difficulty
              )}`}
            >
              {question.difficulty || "Easy"}
            </span>

            {question.topic?.name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <FaFolder className="text-indigo-500 text-[10px]" />
                {question.topic.name}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <FaEye className="text-indigo-500 text-[11px]" />
            {question.views || 0}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {question.title}
        </h3>

        {/* Company Pill */}
        {question.company?.name && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <FaBuilding className="text-cyan-600 text-xs" />
            <span>{question.company.name}</span>
          </div>
        )}

        {/* Description Excerpt */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed min-h-[36px]">
          {question.description || "No description provided for this question."}
        </p>
      </div>

      {/* Footer Row */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
            <FaUser className="w-3 h-3 text-slate-400" />
          </div>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
            {question.createdBy?.name || "Admin"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to={`/admin/questions/view/${question._id}`}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 active:scale-95"
            title="View Details"
          >
            <FaEye className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={`/admin/questions/edit/${question._id}`}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-amber-500/20 active:scale-95"
            title="Edit Question"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => onDelete(question._id)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-rose-500/20 active:scale-95 cursor-pointer"
            title="Delete Question"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
