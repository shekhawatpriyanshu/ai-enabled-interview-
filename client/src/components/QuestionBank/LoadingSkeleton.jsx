const LoadingSkeleton = ({
  rows = 6,
  type = "table",
}) => {
  // -----------------------------
  // Card Skeleton
  // -----------------------------
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(rows)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 animate-pulse"
          >
            <div className="h-5 w-2/3 bg-gray-200 rounded mb-4"></div>

            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>

            <div className="h-4 w-3/4 bg-gray-200 rounded mb-5"></div>

            <div className="flex justify-between">
              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>

              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // -----------------------------
  // Table Skeleton
  // -----------------------------
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 px-6 py-5 border-b animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 bg-gray-200 rounded"></div>

          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;