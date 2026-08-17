import { Link } from "react-router-dom";
import { BookOpen, Plus, Sparkles } from "lucide-react";

const QuestionHeader = ({
  title = "Question Bank",
  subtitle = "Practice interview questions by topic, company, and difficulty.",
  showButton = false,
  buttonText = "Add Question",
  buttonLink = "/question-bank/questions/create",
}) => {
  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-500 mb-8 group">
      {/* Ambient Glow Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-400" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">
        {/* Left Icon & Text */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/25 shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-indigo-300/30">
            <BookOpen size={36} />
          </div>

          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Interview Problem & Knowledge Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Button */}
        {showButton && (
          <Link
            to={buttonLink}
            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-indigo-400/20 shrink-0"
          >
            <Plus size={18} />
            <span>{buttonText}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuestionHeader;