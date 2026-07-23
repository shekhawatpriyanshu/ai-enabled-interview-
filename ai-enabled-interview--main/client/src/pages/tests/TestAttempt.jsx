import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/tests/ProgressBar";
import LoadingSkeleton from "../../components/tests/LoadingSkeleton";

const TestAttempt = ({
  questions = [],
  loading = false,
  onSubmit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 min default

  const currentQuestion = questions[currentIndex];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: option,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          Test Attempt
        </h1>

        <div className="text-red-600 font-semibold text-lg">
          ⏳ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        totalQuestions={questions.length}
        answeredQuestions={answeredCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Question Section */}
        <div className="md:col-span-3 bg-white shadow rounded-2xl p-6">
          {currentQuestion ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Q{currentIndex + 1}. {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options?.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      answers[currentQuestion._id] === opt
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No questions available</p>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white shadow rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Question Navigator</h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <button
                key={q._id || i}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold ${
                  answers[q._id]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg"
          >
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;