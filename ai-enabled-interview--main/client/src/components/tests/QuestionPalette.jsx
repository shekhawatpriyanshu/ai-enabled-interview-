import {
  FaCheckCircle,
  FaRegCircle,
  FaFlag,
} from "react-icons/fa";

const QuestionPalette = ({
  questions,
  answers,
  currentQuestion,
  setCurrentQuestion,
  onSubmit,
}) => {
  const answered = questions.filter(
    (q) => answers[q._id]
  ).length;

  const unanswered =
    questions.length - answered;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-5">

      {/* Header */}

      <h2 className="text-2xl font-bold">
        Question Palette
      </h2>

      <p className="text-gray-500 mt-1">
        Navigate between questions
      </p>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-3 mt-6">

        <div className="bg-green-50 rounded-xl p-4">

          <p className="text-gray-500 text-sm">
            Answered
          </p>

          <h3 className="text-2xl font-bold text-green-600 mt-2">
            {answered}
          </h3>

        </div>

        <div className="bg-red-50 rounded-xl p-4">

          <p className="text-gray-500 text-sm">
            Remaining
          </p>

          <h3 className="text-2xl font-bold text-red-600 mt-2">
            {unanswered}
          </h3>

        </div>

      </div>

      {/* Progress */}

      <div className="mt-8">

        <div className="flex justify-between mb-2">

          <span className="font-semibold">
            Progress
          </span>

          <span className="font-semibold text-cyan-600">
            {answered}/{questions.length}
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${
                (answered / questions.length) * 100
              }%`,
            }}
          />

        </div>

      </div>

      {/* Question Grid */}

      <div className="grid grid-cols-5 gap-3 mt-8">

        {questions.map((question, index) => {

          const isAnswered =
            answers[question._id];

          const isCurrent =
            currentQuestion === index;

          return (
            <button
              key={question._id}
              onClick={() =>
                setCurrentQuestion(index)
              }
              className={`h-12 rounded-lg font-bold transition

              ${
                isCurrent
                  ? "bg-blue-600 text-white"
                  : isAnswered
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }
              `}
            >
              {index + 1}
            </button>
          );

        })}

      </div>

      {/* Legend */}

      <div className="mt-8 space-y-3">

        <div className="flex items-center gap-3">

          <FaCheckCircle className="text-green-500" />

          <span>Answered</span>

        </div>

        <div className="flex items-center gap-3">

          <FaRegCircle className="text-gray-500" />

          <span>Not Answered</span>

        </div>

        <div className="flex items-center gap-3">

          <FaFlag className="text-blue-500" />

          <span>Current Question</span>

        </div>

      </div>

      {/* Submit */}

      <button
        onClick={onSubmit}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Submit Test
      </button>

    </div>
  );
};

export default QuestionPalette;