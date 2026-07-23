import React from "react";

const ProgressBar = ({
  label,
  value,
  color = "bg-blue-600",
  showPercentage = true,
}) => {
  return (
    <div className="space-y-2">

      <div className="flex justify-between items-center">

        <span className="font-medium text-gray-700">
          {label}
        </span>

        {showPercentage && (
          <span className="font-semibold">
            {value}%
          </span>
        )}

      </div>

      <div className="w-full h-3 rounded-full bg-gray-200">

        <div
          className={`h-3 rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
};

export default ProgressBar;