const LoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">

      <div className="h-10 w-72 bg-gray-300 rounded" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {[1,2,3,4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="h-5 w-32 bg-gray-300 rounded mb-5" />

            <div className="h-10 w-20 bg-gray-300 rounded mb-5" />

            <div className="h-3 bg-gray-200 rounded" />
          </div>
        ))}

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="h-6 w-56 bg-gray-300 rounded mb-6" />

        <div className="space-y-4">

          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />

        </div>

      </div>

    </div>
  );
};

export default LoadingSkeleton;