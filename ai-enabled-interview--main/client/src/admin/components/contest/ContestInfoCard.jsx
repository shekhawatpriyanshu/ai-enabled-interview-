import {
  FaClock,
  FaCalendarAlt,
  FaFlag,
  FaCode,
} from "react-icons/fa";

const ContestInfoCard = ({ contest }) => {
  if (!contest) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";

      case "Live":
        return "bg-green-100 text-green-700";

      case "Completed":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">

      <div className="border-b px-6 py-4">

        <h2 className="text-xl font-semibold">
          Contest Information
        </h2>

      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">

        {/* Title */}

        <div>

          <label className="text-sm font-medium text-gray-500">
            Contest Title
          </label>

          <p className="mt-1 text-lg font-semibold">
            {contest.title}
          </p>

        </div>

        {/* Status */}

        <div>

          <label className="text-sm font-medium text-gray-500">
            Status
          </label>

          <div className="mt-2">

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                contest.status
              )}`}
            >
              {contest.status}
            </span>

          </div>

        </div>

        {/* Duration */}

        <div className="flex items-start gap-3">

          <FaClock
            className="mt-1 text-blue-600"
          />

          <div>

            <label className="text-sm font-medium text-gray-500">
              Duration
            </label>

            <p className="mt-1">
              {contest.duration} Minutes
            </p>

          </div>

        </div>

        {/* Problems */}

        <div className="flex items-start gap-3">

          <FaCode
            className="mt-1 text-green-600"
          />

          <div>

            <label className="text-sm font-medium text-gray-500">
              Problems
            </label>

            <p className="mt-1">
              {contest.problems?.length || 0}
            </p>

          </div>

        </div>

        {/* Start */}

        <div className="flex items-start gap-3">

          <FaCalendarAlt
            className="mt-1 text-purple-600"
          />

          <div>

            <label className="text-sm font-medium text-gray-500">
              Start Time
            </label>

            <p className="mt-1">
              {new Date(
                contest.startTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* End */}

        <div className="flex items-start gap-3">

          <FaFlag
            className="mt-1 text-red-600"
          />

          <div>

            <label className="text-sm font-medium text-gray-500">
              End Time
            </label>

            <p className="mt-1">
              {new Date(
                contest.endTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="border-t p-6">

        <h3 className="mb-3 text-lg font-semibold">
          Description
        </h3>

        <p className="whitespace-pre-line leading-7 text-gray-700">
          {contest.description}
        </p>

      </div>

    </div>
  );
};

export default ContestInfoCard;