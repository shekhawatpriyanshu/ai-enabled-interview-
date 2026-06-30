import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>

      {/* Progress Bar Skeleton */}
      <div className="h-3 w-full bg-gray-300 rounded-full"></div>

      {/* Question Card Skeleton */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">
        <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
      </div>

      {/* Options Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
        <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
      </div>

      {/* Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;