import React from "react";

const EmptyState = ({
  title = "No Data Found",
  message = "There is nothing to show right now.",
  actionText = "",
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 13h8M8 17h5"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>

      {/* Message */}
      <p className="text-gray-500 mt-2 max-w-md">
        {message}
      </p>

      {/* Optional Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;