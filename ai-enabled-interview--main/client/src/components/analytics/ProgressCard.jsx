// src/components/analytics/ProgressCard.jsx

import { FaCheckCircle } from "react-icons/fa";

const progressColors = {
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
  indigo: "bg-indigo-600",
};

const ProgressCard = ({
  title,
  value = 0,
  target = 100,
  color = "blue",
}) => {
  // Prevent divide by zero
  const percentage =
    target > 0
      ? Math.min(Math.round((value / target) * 100), 100)
      : 0;

  const completed = value >= target;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h6 className="text-sm font-bold text-slate-700 mb-0">
          {title}
        </h6>

        {completed ? (
          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <FaCheckCircle className="text-emerald-600" size={10} />
            Completed
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold px-2 py-0.5 rounded-full">
            {percentage}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${
            progressColors[color] || progressColors.blue
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-3 text-xs text-slate-500">
        <span>
          {value} completed
        </span>

        <span className="font-semibold text-slate-700">
          Goal: {target}
        </span>
      </div>

    </div>
  );
};

export default ProgressCard;