const QuestionCard = ({
  question,
  index,
  onAnswerChange,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10">

      {/* Question Number Badge */}
      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-lg font-bold text-white shadow-lg">
          {index + 1}
        </div>

        <div>
          <h3 className="text-lg  text-black font-mono">
            Interview Question
          </h3>

          <p className="text-sm text-slate-400">
            Answer in detail
          </p>
        </div>

      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl bg-cyan-500 p-5 border border-slate-700">

        <p className="text-lg leading-relaxed text-white-200">
          {question.question}
        </p>

      </div>

      {/* Answer Box */}
      <div>

        <label className="mb-3 block text-sm font-medium text-black">
          Your Answer
        </label>

        <textarea
          rows={8}
          value={question.answer}
          onChange={(e) =>
            onAnswerChange(
              index,
              e.target.value
            )
          }
          placeholder="Explain your answer here..."
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-white-100
            p-5
            text-black
            placeholder:text-slate-500
            resize-none
            transition-all
            duration-300
            focus:border-cyan-500
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500/40
          "
        />

      </div>

      {/* Character Counter */}
      <div className="mt-3 flex justify-end ">

        <span className="text-xs text-black">
          {question.answer?.length || 0} characters
        </span>

      </div>

    </div>
  );
};

export default QuestionCard;