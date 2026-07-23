import { Link } from "react-router-dom";
import {
  Calendar,
  Clock3,
  FileCode2,
  Trophy,
  ArrowRight,
} from "lucide-react";

const statusColors = {
  Upcoming:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  Live:
    "bg-green-100 text-green-700 border-green-200",

  Completed:
    "bg-gray-100 text-gray-700 border-gray-200",
};

const ContestCard = ({ contest }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            {contest.title}
          </h2>

          <p className="text-gray-500 mt-2 line-clamp-2">
            {contest.description}
          </p>

        </div>

        <div
          className={`px-3 py-1 rounded-full border text-sm font-medium ${
            statusColors[contest.status]
          }`}
        >
          {contest.status}
        </div>

      </div>

      {/* Information */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="flex items-center gap-2 text-gray-600">

          <Calendar
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm">
            {new Date(
              contest.startTime
            ).toLocaleDateString()}
          </span>

        </div>

        <div className="flex items-center gap-2 text-gray-600">

          <Clock3
            size={18}
            className="text-green-600"
          />

          <span className="text-sm">
            {contest.duration} mins
          </span>

        </div>

        <div className="flex items-center gap-2 text-gray-600">

          <FileCode2
            size={18}
            className="text-purple-600"
          />

          <span className="text-sm">
            {contest.problems?.length || 0} Problems
          </span>

        </div>

        <div className="flex items-center gap-2 text-gray-600">

          <Trophy
            size={18}
            className="text-orange-500"
          />

          <span className="text-sm">
            Coding Contest
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex justify-end">

        <Link
          to={`/contests/${contest._id}`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
        >
          View Details

          <ArrowRight size={18} />
        </Link>

      </div>

    </div>
  );
};

export default ContestCard;