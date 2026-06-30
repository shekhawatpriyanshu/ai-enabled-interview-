import {
  Calendar,
  Clock3,
  Trophy,
} from "lucide-react";

const statusStyles = {
  Upcoming:
    "bg-yellow-100 text-yellow-700 border-yellow-300",

  Live:
    "bg-green-100 text-green-700 border-green-300",

  Completed:
    "bg-gray-100 text-gray-700 border-gray-300",
};

const ContestHeader = ({ contest }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">

      {/* Top */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        <div>

          <div className="flex items-center gap-3">

            <Trophy
              size={32}
              className="text-yellow-500"
            />

            <h1 className="text-3xl font-bold text-gray-900">
              {contest.title}
            </h1>

          </div>

          <p className="mt-5 text-gray-600 leading-7">
            {contest.description}
          </p>

        </div>

        <div>

          <span
            className={`inline-flex px-4 py-2 rounded-full border font-semibold ${
              statusStyles[contest.status]
            }`}
          >
            {contest.status}
          </span>

        </div>

      </div>

      {/* Divider */}

      <div className="border-t my-8"></div>

      {/* Contest Info */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Start */}

        <div className="flex items-center gap-3">

          <Calendar
            className="text-blue-600"
            size={22}
          />

          <div>

            <p className="text-sm text-gray-500">
              Start Time
            </p>

            <p className="font-semibold">
              {new Date(
                contest.startTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* End */}

        <div className="flex items-center gap-3">

          <Calendar
            className="text-red-500"
            size={22}
          />

          <div>

            <p className="text-sm text-gray-500">
              End Time
            </p>

            <p className="font-semibold">
              {new Date(
                contest.endTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* Duration */}

        <div className="flex items-center gap-3">

          <Clock3
            className="text-green-600"
            size={22}
          />

          <div>

            <p className="text-sm text-gray-500">
              Duration
            </p>

            <p className="font-semibold">
              {contest.duration} Minutes
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ContestHeader;