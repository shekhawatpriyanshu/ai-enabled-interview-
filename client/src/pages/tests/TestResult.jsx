import React from "react";
import ResultCard from "../../components/tests/ResultCard";

const TestResult = ({ result = {}, questions = [] }) => {
  const {
    totalQuestions = 0,
    correct = 0,
    wrong = 0,
    unanswered = 0,
    answers = {},
  } = result;

  const getAnswerStatus = (q) => {
    const userAnswer = answers[q._id];
    if (!userAnswer) return "unanswered";
    if (userAnswer === q.correctAnswer) return "correct";
    return "wrong";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Test Result Summary
      </h1>

      {/* Result Card */}
      <div className="mb-8">
        <ResultCard
          totalQuestions={totalQuestions}
          correct={correct}
          wrong={wrong}
          unanswered={unanswered}
        />
      </div>

      {/* Review Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Question Review
        </h2>

        <div className="space-y-5">
          {questions.map((q, index) => {
            const status = getAnswerStatus(q);

            return (
              <div
                key={q._id || index}
                className={`p-4 rounded-lg border ${
                  status === "correct"
                    ? "border-green-400 bg-green-50"
                    : status === "wrong"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                {/* Question */}
                <h3 className="font-semibold text-gray-800">
                  Q{index + 1}. {q.question}
                </h3>

                {/* Options */}
                <div className="mt-3 space-y-1 text-sm">
                  {q.options.map((opt, i) => {
                    const isUserAnswer = answers[q._id] === opt;
                    const isCorrect = q.correctAnswer === opt;

                    return (
                      <div
                        key={i}
                        className={`px-3 py-2 rounded ${
                          isCorrect
                            ? "bg-green-200 font-semibold"
                            : isUserAnswer
                            ? "bg-red-200"
                            : "bg-white"
                        }`}
                      >
                        {opt}
                        {isCorrect && " ✅ (Correct Answer)"}
                        {isUserAnswer && !isCorrect && " ❌ (Your Answer)"}
                      </div>
                    );
                  })}
                </div>

                {/* Status */}
                <div className="mt-3 text-sm font-semibold">
                  Status:{" "}
                  {status === "correct" && (
                    <span className="text-green-600">Correct</span>
                  )}
                  {status === "wrong" && (
                    <span className="text-red-600">Wrong</span>
                  )}
                  {status === "unanswered" && (
                    <span className="text-gray-600">Unanswered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestResult;