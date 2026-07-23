const LoadingSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">

      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Timer Skeleton */}
      <div className="h-24 bg-gray-200 rounded-xl"></div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Join Button Skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>

      {/* Problems Skeleton */}
      <div className="space-y-3 mt-6">
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>

      {/* Leaderboard Skeleton */}
      <div className="mt-8 space-y-3">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>

    </div>
  );
};

export default LoadingSkeleton;