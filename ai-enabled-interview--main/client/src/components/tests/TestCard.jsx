import { Link } from "react-router-dom";
import {
  FaClock,
  FaLayerGroup,
  FaPlayCircle,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const TestCard = ({ test }) => {
  const getDifficultyColor = () => {
    switch (test.difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Hard":
        return "bg-rose-50 text-rose-700 border-rose-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-200/90 relative flex flex-col justify-between">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start gap-3">
          <h2 className="text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {test.title}
          </h2>

          <span
            className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getDifficultyColor()}`}
          >
            {test.difficulty}
          </span>
        </div>

        <p className="text-slate-500 text-xs font-medium line-clamp-2 mt-2 leading-relaxed min-h-[36px]">
          {test.description || "Comprehensive placement assessment to test fundamental technical knowledge."}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 group-hover:bg-indigo-50/40 transition-colors">
            <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <FaLayerGroup size={11} />
              <span>Questions</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">
              {test.questions?.length || 0}
            </h3>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 group-hover:bg-purple-50/40 transition-colors">
            <div className="flex items-center gap-1.5 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <FaClock size={11} />
              <span>Duration</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">
              {test.duration} min
            </h3>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <FaStar className="text-amber-400" /> Total Marks
          </span>
          <span className="font-extrabold text-sm text-slate-800 bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-lg">
            {test.totalMarks || test.questions?.length || 0} PTS
          </span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex gap-3">
        <Link
          to={`/tests/${test._id}`}
          className="flex-1"
        >
          <button className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 cursor-pointer shadow-xs active:scale-95">
            <FaArrowRight size={10} /> Details
          </button>
        </Link>

        <Link
          to={`/tests/${test._id}/attempt`}
          className="flex-1"
        >
          <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-95 shadow-md shadow-indigo-500/20 transition-all duration-300 cursor-pointer">
            <FaPlayCircle size={12} /> Start Test
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TestCard;