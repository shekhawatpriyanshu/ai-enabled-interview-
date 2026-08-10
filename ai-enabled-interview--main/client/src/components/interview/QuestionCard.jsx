const optionLabels = ["A", "B", "C", "D", "E", "F"];

const QuestionCard = ({
  question,
  index,
  onAnswerChange,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]">
      {/* Question Number & Info Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 font-extrabold text-white text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
            {index + 1}
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Question #{index + 1}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the single best answer below
            </p>
          </div>
        </div>

        {question.answer ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Answered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            Pending
          </span>
        )}
      </div>

      {/* Question Text Box */}
      <div className="mb-6 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shadow-inner">
        <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-100">
          {question.question}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3.5 mt-4">
        {question.options &&
          question.options.map((option, i) => {
            const isSelected = question.answer === option;
            const labelBadge = optionLabels[i] || `${i + 1}`;

            return (
              <label
                key={i}
                onClick={() => onAnswerChange(index, option)}
                className={`group/opt relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? "border-cyan-400 bg-gradient-to-r from-cyan-500/20 via-slate-900 to-purple-500/20 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.01]"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-800/60 hover:-translate-y-0.5 text-slate-300"
                }`}
              >
                {/* Option Letter Badge (A, B, C, D) */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                      : "bg-slate-800 text-slate-400 group-hover/opt:bg-slate-700 group-hover/opt:text-white"
                  }`}
                >
                  {labelBadge}
                </div>

                {/* Radio Input */}
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => {}}
                  className="hidden"
                />

                {/* Option Text */}
                <span
                  className={`text-sm sm:text-base font-medium leading-snug transition-colors ${
                    isSelected ? "text-cyan-200 font-semibold" : "text-slate-300 group-hover/opt:text-white"
                  }`}
                >
                  {option}
                </span>

                {/* Checkmark Indicator */}
                {isSelected && (
                  <div className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>
            );
          })}
      </div>
    </div>
  );
};

export default QuestionCard;