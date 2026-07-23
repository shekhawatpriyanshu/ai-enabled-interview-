const LoadingSkeleton = ({
  rows = 6,
}) => {
  return (
    <div className="space-y-5 animate-pulse">

      {Array.from({
        length: rows,
      }).map((_, index) => (

        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-6"
        >

          {/* Header */}

          <div className="flex justify-between">

            <div className="space-y-3">

              <div className="h-6 w-56 bg-gray-200 rounded"></div>

              <div className="h-4 w-40 bg-gray-200 rounded"></div>

            </div>

            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>

          </div>

          {/* Body */}

          <div className="mt-6 space-y-3">

            <div className="h-4 bg-gray-200 rounded w-full"></div>

            <div className="h-4 bg-gray-200 rounded w-11/12"></div>

            <div className="h-4 bg-gray-200 rounded w-10/12"></div>

            <div className="h-4 bg-gray-200 rounded w-8/12"></div>

          </div>

          {/* Footer */}

          <div className="flex justify-between mt-8">

            <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>

            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>

          </div>

        </div>

      ))}

    </div>
  );
};

export default LoadingSkeleton;