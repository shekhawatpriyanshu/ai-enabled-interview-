import React from "react";

const StatisticsCard = ({
  title,
  value,
  icon,
  color = "blue",
}) => {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },

    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },

    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100",
    },

    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-100",
    },

    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },

    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-100",
    },
  };

  const theme =
    colors[color] || colors.blue;

  return (
    <div
      className={`bg-white rounded-2xl border ${theme.border} shadow-sm p-6 hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-800">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${theme.bg}`}
        >
          <div
            className={`text-2xl ${theme.text}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;