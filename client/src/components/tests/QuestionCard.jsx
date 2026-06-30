import {
  FaCheckCircle,
} from "react-icons/fa";

const QuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      {/* Header */}

      <div className="flex justify-between items-center border-b pb-5">

        <div>

          <h2 className="text-2xl font-bold">
            Question {currentQuestion + 1}
          </h2>

          <p className="text-gray-500 mt-1">
            {currentQuestion + 1} of {totalQuestions}
          </p>

        </div>

        <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-semibold">

          {question.marks || 1} Mark

        </div>

      </div>

      {/* Question */}

      <div className="mt-8">

        <p className="text-xl leading-8 font-medium text-gray-800 whitespace-pre-wrap">
          {question.question}
        </p>

      </div>

      {/* Options */}

      <div className="mt-10 space-y-4">

        {question.options?.map((option, index) => {

          const isSelected =
            selectedAnswer === option;

          return (
            <button
              key={index}
              onClick={() =>
                onSelectAnswer(option)
              }
              className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 flex justify-between items-center

              ${
                isSelected
                  ? "bg-cyan-600 border-cyan-600 text-white shadow-lg"
                  : "bg-white border-gray-200 hover:border-cyan-500 hover:bg-cyan-50"
              }
              `}
            >

              <div className="flex gap-4">

                <span className="font-bold">
                  {String.fromCharCode(
                    65 + index
                  )}
                  .
                </span>

                <span>{option}</span>

              </div>

              {isSelected && (
                <FaCheckCircle className="text-2xl" />
              )}

            </button>
          );
        })}

      </div>

      {/* Footer */}

      <div className="mt-10 border-t pt-5 flex justify-between items-center">

        <div className="text-sm text-gray-500">

          Select one correct answer

        </div>

        <div
          className={`px-4 py-2 rounded-full font-semibold ${
            selectedAnswer
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {selectedAnswer
            ? "Answered"
            : "Not Answered"}
        </div>

      </div>

    </div>
  );
};

export default QuestionCard;