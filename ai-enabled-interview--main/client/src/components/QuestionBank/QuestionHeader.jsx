import { Link } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";

const QuestionHeader = ({
  title = "Question Bank",
  subtitle = "Practice interview questions by topic, company, and difficulty.",
  showButton = false,
  buttonText = "Add Question",
  buttonLink = "/question-bank/questions/create",
}) => {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all mb-6">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Icon & Text */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
            <BookOpen size={28} />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1 font-semibold">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        {showButton && (
          <Link
            to={buttonLink}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <Plus size={20} />
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuestionHeader;