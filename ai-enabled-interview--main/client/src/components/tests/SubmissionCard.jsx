import React from "react";

const SubmissionCard = ({
  testTitle = "Mock Test",
  score = 0,
  totalQuestions = 0,
  correct = 0,
  wrong = 0,
  date = "",
  onView = null,
  onRetry = null,
}) => {
  const percentage = totalQuestions
    ? Math.round((correct / totalQuestions) * 100)
    : 0;

  const getStatusColor = () => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-blue-600 bg-blue-100";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {testTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {date || "No date available"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}
        >
          {percentage}%
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-5 text-center text-sm">
        <div>
          <p className="text-gray-500">Correct</p>
          <p className="font-semibold text-green-600">{correct}</p>
        </div>

        <div>
          <p className="text-gray-500">Wrong</p>
          <p className="font-semibold text-red-500">{wrong}</p>
        </div>

        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-semibold text-gray-800">{totalQuestions}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onView}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Result
        </button>

        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default SubmissionCard;