import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge";

const QuestionRow = ({ question }) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group">
      {/* Title */}
      <td className="px-5 py-4 font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
        <Link to={`/question-bank/questions/${question._id}`} className="hover:underline">
          {question.title}
        </Link>
      </td>

      {/* Difficulty */}
      <td className="px-5 py-4">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>

      {/* Topic */}
      <td className="px-5 py-4 text-slate-600 text-sm font-semibold">
        {question.topic?.name ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs">
            {question.topic.name}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">General</span>
        )}
      </td>

      {/* Company */}
      <td className="px-5 py-4 text-slate-600 text-sm font-semibold">
        {question.company?.name ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs">
            🏢 {question.company.name}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>

      {/* Tags */}
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {question.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </td>

      {/* Action */}
      <td className="px-5 py-4 text-right">
        <Link
          to={`/question-bank/questions/${question._id}`}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <span>View</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </td>
    </tr>
  );
};

export default QuestionRow;