const LoadingSkeleton = ({
  cards = 4,
  type = "card",
}) => {
  if (type === "chat") {
    return (
      <div className="space-y-5 animate-pulse">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div className="w-72 rounded-xl bg-white border p-4">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-full bg-gray-200" />

                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>

              </div>

              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6">

      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-xl border shadow-sm p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full bg-gray-200" />

            <div className="flex-1">
              <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>

          </div>

          {/* Title */}
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-5" />

          {/* Content */}
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            <div className="w-20 h-8 rounded-full bg-gray-200" />
            <div className="w-16 h-8 rounded-full bg-gray-200" />
            <div className="w-24 h-8 rounded-full bg-gray-200" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">

            <div className="flex gap-6">
              <div className="w-12 h-5 rounded bg-gray-200" />
              <div className="w-12 h-5 rounded bg-gray-200" />
            </div>

            <div className="w-32 h-10 rounded-lg bg-gray-200" />

          </div>

        </div>
      ))}

    </div>
  );
};

export default LoadingSkeleton;