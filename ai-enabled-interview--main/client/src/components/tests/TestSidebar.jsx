import {
  FaCheckCircle,
  FaRegCircle,
  FaQuestionCircle,
  FaPaperPlane,
} from "react-icons/fa";

const TestSidebar = ({
  questions = [],
  currentQuestion,
  answers = {},
  onQuestionChange,
  onSubmit,
}) => {
  const answeredCount = Object.keys(answers).filter(
    (key) =>
      answers[key] !== undefined &&
      answers[key] !== null &&
      answers[key] !== ""
  ).length;

  const unansweredCount =
    questions.length - answeredCount;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 sticky top-4">

      {/* Header */}

      <div className="border-b px-6 py-5">

        <h2 className="text-xl font-bold">
          Question Palette
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Jump directly to any question.
        </p>

      </div>

      {/* Summary */}

      <div className="p-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-green-50 rounded-xl p-4 text-center">

            <FaCheckCircle className="mx-auto text-green-600 text-2xl mb-2" />

            <p className="text-sm text-gray-500">
              Answered
            </p>

            <h3 className="text-2xl font-bold text-green-600">
              {answeredCount}
            </h3>

          </div>

          <div className="bg-red-50 rounded-xl p-4 text-center">

            <FaRegCircle className="mx-auto text-red-500 text-2xl mb-2" />

            <p className="text-sm text-gray-500">
              Remaining
            </p>

            <h3 className="text-2xl font-bold text-red-600">
              {unansweredCount}
            </h3>

          </div>

        </div>

      </div>

      {/* Question Numbers */}

      <div className="px-6 pb-6">

        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FaQuestionCircle />
          Questions
        </h3>

        <div className="grid grid-cols-5 gap-3">

          {questions.map((_, index) => {
            const answered =
              answers[index] !== undefined &&
              answers[index] !== null &&
              answers[index] !== "";

            const active =
              currentQuestion === index;

            return (
              <button
                key={index}
                onClick={() =>
                  onQuestionChange(index)
                }
                className={`h-11 w-11 rounded-xl font-bold transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : answered
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            );
          })}

        </div>

      </div>

      {/* Legend */}

      <div className="border-t px-6 py-5 space-y-3">

        <div className="flex items-center gap-3">

          <div className="w-5 h-5 rounded bg-blue-600"></div>

          <span className="text-sm">
            Current Question
          </span>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-5 h-5 rounded bg-green-500"></div>

          <span className="text-sm">
            Answered
          </span>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-5 h-5 rounded bg-gray-300"></div>

          <span className="text-sm">
            Not Answered
          </span>

        </div>

      </div>

      {/* Submit */}

      <div className="px-6 pb-6">

        <button
          onClick={onSubmit}
          className="w-full flex justify-center items-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />
          Submit Test
        </button>

      </div>

    </div>
  );
};

export default TestSidebar;