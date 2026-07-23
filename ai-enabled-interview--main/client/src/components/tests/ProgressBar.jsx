import React, { useEffect, useState } from "react";

const ProgressBar = ({ totalQuestions = 0, answeredQuestions = 0 }) => {
  const [progress, setProgress] = useState(0);

  const unansweredQuestions = totalQuestions - answeredQuestions;

  useEffect(() => {
    const percentage =
      totalQuestions === 0
        ? 0
        : Math.round((answeredQuestions / totalQuestions) * 100);

    // smooth animation
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval);
      }
      setProgress(start);
    }, 15);

    return () => clearInterval(interval);
  }, [answeredQuestions, totalQuestions]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Test Progress
        </h2>
        <span className="text-sm font-medium text-blue-600">
          {progress}%
        </span>
      </div>

      {/* Progress Bar Background */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <div>
          <span className="font-semibold text-green-600">
            {answeredQuestions}
          </span>{" "}
          Answered
        </div>

        <div>
          <span className="font-semibold text-red-500">
            {unansweredQuestions}
          </span>{" "}
          Unanswered
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            {totalQuestions}
          </span>{" "}
          Total
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;