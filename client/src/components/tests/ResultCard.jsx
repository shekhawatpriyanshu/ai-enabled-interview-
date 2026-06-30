import React from "react";

const ResultCard = ({
  totalQuestions = 0,
  correct = 0,
  wrong = 0,
  unanswered = 0,
}) => {
  const score = totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0;

  const getBadge = () => {
    if (score >= 80) return { text: "Excellent", color: "text-green-600" };
    if (score >= 60) return { text: "Good", color: "text-blue-600" };
    if (score >= 40) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const badge = getBadge();

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Test Result
        </h2>
        <span className={`font-semibold ${badge.color}`}>
          {badge.text}
        </span>
      </div>

      {/* Score Circle */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="w-28 h-28 rounded-full border-8 border-gray-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {score}%
          </span>
        </div>
        <p className="text-gray-500 mt-2">Overall Score</p>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Correct Answers</span>
          <span className="font-semibold text-green-600">{correct}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Wrong Answers</span>
          <span className="font-semibold text-red-500">{wrong}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Unanswered</span>
          <span className="font-semibold text-gray-500">{unanswered}</span>
        </div>

        <div className="flex justify-between border-t pt-3 mt-3">
          <span className="text-gray-700 font-medium">Total Questions</span>
          <span className="font-bold">{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;