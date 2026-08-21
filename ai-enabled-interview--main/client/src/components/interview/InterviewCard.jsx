import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaCheckCircle,
  FaHourglassHalf,
  FaChevronRight,
  FaCalendarAlt,
  FaQuestionCircle,
  FaStar,
} from "react-icons/fa";

const InterviewCard = ({ interview }) => {
  const isCompleted = interview.status === "Completed" || interview.status === "completed";
  const displayScore =
    interview.overallScore ??
    interview.score ??
    interview.mcqScore ??
    interview.finalResult?.overallScore ??
    interview.feedback?.score ??
    (interview.totalScore !== undefined ? Math.round((interview.totalScore / (interview.maxScore || 100)) * 100) : null);

  const dateFormatted = interview.createdAt
    ? new Date(interview.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/interviews/${interview._id}`}
        className="group block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-400 transition-all duration-300 relative overflow-hidden text-slate-800"
      >
        {/* Top Accent Gradient Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            isCompleted
              ? "from-emerald-500 via-teal-500 to-cyan-500"
              : "from-amber-500 via-orange-500 to-yellow-500"
          }`}
        />

        {/* Card Header: Icon + Title + Status Pill */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xs ${
                isCompleted
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/20"
              }`}
            >
              <FaUserTie />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-snug break-words">
                {interview.role || "Software Developer"}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5 capitalize truncate">
                {interview.experienceLevel || "Intermediate"} Level
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border shrink-0 shadow-2xs self-start ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
            }`}
          >
            {isCompleted ? (
              <FaCheckCircle className="text-emerald-600 text-[9px]" />
            ) : (
              <FaHourglassHalf className="text-amber-600 text-[9px] animate-spin" />
            )}
            <span>{interview.status}</span>
          </span>
        </div>



        {/* Card Metrics & Details */}
        <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <FaQuestionCircle className="text-indigo-500 text-xs shrink-0" />
            <span>
              {interview.questions?.length || 0} Questions
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 justify-end">
            <FaCalendarAlt className="text-purple-500 text-xs shrink-0" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Overall Score Badge if completed */}
        {isCompleted && displayScore !== null && displayScore !== undefined && (
          <div className="mt-3.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-tight text-slate-500 flex items-center gap-1.5 shrink-0">
              <FaStar className="text-amber-500 text-xs shrink-0" />
              <span>Overall Score</span>
            </span>
            <span className="text-xs font-black text-slate-900 bg-white border border-slate-200/90 px-3 py-1 rounded-xl shadow-2xs whitespace-nowrap shrink-0">
              {displayScore} / 100
            </span>
          </div>
        )}

        {/* Card Bottom CTA */}
        <div className="mt-4 flex items-center justify-between text-xs font-black text-indigo-600 group-hover:text-indigo-700 transition-colors">
          <span>View Session & AI Feedback</span>
          <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </Link>
    </motion.div>
  );
};

export default InterviewCard;