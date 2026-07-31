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
            Select the correct option
          </p>
        </div>

      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl bg-cyan-500 p-5 border border-slate-700">

        <p className="text-lg leading-relaxed text-white-200">
          {question.question}
        </p>

      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-4">
        {question.options && question.options.map((option, i) => (
          <label 
            key={i} 
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              question.answer === option 
                ? 'border-cyan-500 bg-cyan-50' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <input 
              type="radio" 
              name={`question-${index}`} 
              value={option}
              checked={question.answer === option}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              className="w-5 h-5 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-slate-700 font-medium">{option}</span>
          </label>
        ))}
      </div>

    </div>
  );
};

export default QuestionCard;