import { format } from "date-fns";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const SubmissionCard = ({
  submission,
}) => {
  const getStatusIcon = () => {
    switch (submission.status) {
      case "Accepted":
        return (
          <FaCheckCircle className="text-green-600 text-xl" />
        );

      case "Wrong Answer":
      case "Runtime Error":
      case "Compilation Error":
      case "Time Limit Exceeded":
        return (
          <FaTimesCircle className="text-red-600 text-xl" />
        );

      default:
        return (
          <FaClock className="text-gray-500 text-xl" />
        );
    }
  };

  const getStatusColor = () => {
    switch (submission.status) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Wrong Answer":
        return "bg-red-100 text-red-700";

      case "Runtime Error":
        return "bg-orange-100 text-orange-700";

      case "Compilation Error":
        return "bg-yellow-100 text-yellow-700";

      case "Time Limit Exceeded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold text-gray-800">
            {submission.problem?.title}
          </h2>

          <p className="text-gray-500 mt-1">
            {format(
              new Date(submission.createdAt),
              "dd MMM yyyy • hh:mm a"
            )}
          </p>

        </div>

        {getStatusIcon()}

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div>

          <p className="text-sm text-gray-500">
            Difficulty
          </p>

          <p className="font-semibold">
            {submission.problem?.difficulty}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Language
          </p>

          <p className="font-semibold capitalize">
            {submission.language}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Score
          </p>

          <p className="font-semibold">
            {submission.score}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Status
          </p>

          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {submission.status}
          </span>

        </div>

      </div>

    </div>
  );
};

export default SubmissionCard;