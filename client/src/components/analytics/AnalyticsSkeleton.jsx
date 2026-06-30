// src/components/analytics/AnalyticsSkeleton.jsx

const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-slate-100/80 border border-slate-200/60 rounded-3xl animate-pulse ${className}`} />
);

const AnalyticsSkeleton = () => {
  return (
    <div className="py-2 space-y-8">

      {/* Header Skeleton */}
      <SkeletonCard className="h-44 w-full" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard className="h-32" key={index} />
        ))}
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Goals Progress */}
        <div className="space-y-4 lg:col-span-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard className="h-24" key={index} />
          ))}
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <SkeletonCard className="h-[464px] w-full" />
        </div>

      </div>

      {/* Rewards */}
      <div className="mt-8">
        <div className="h-6 w-40 bg-slate-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard className="h-72" key={index} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsSkeleton;