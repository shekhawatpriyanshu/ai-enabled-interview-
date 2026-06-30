import { Link } from "react-router-dom";
import {
  FaClock,
  FaLayerGroup,
  FaPlayCircle,
  FaArrowRight,
} from "react-icons/fa";

const TestCard = ({ test }) => {
  const getDifficultyColor = () => {
    switch (test.difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Hard":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">

      {/* Header */}

      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-5">

        <div className="flex justify-between items-start">

          <h2 className="text-xl font-bold line-clamp-2">
            {test.title}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor()}`}
          >
            {test.difficulty}
          </span>

        </div>

      </div>

      {/* Body */}

      <div className="p-5">

        <p className="text-gray-600 line-clamp-3 min-h-[70px]">
          {test.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">

          <div className="bg-slate-100 rounded-xl p-3">

            <div className="flex items-center gap-2 text-cyan-600">

              <FaLayerGroup />

              <span className="font-semibold">
                Questions
              </span>

            </div>

            <h3 className="text-xl font-bold mt-2">
              {test.questions?.length || 0}
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-3">

            <div className="flex items-center gap-2 text-cyan-600">

              <FaClock />

              <span className="font-semibold">
                Duration
              </span>

            </div>

            <h3 className="text-xl font-bold mt-2">
              {test.duration} min
            </h3>

          </div>

        </div>

        <div className="mt-5 flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Total Marks
            </p>

            <h3 className="font-bold text-lg">
              {test.totalMarks}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-gray-500 text-sm">
              Created By
            </p>

            <h3 className="font-semibold">
              {test.createdBy?.name || "Admin"}
            </h3>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t p-5 flex gap-3">

        <Link
          to={`/tests/${test._id}`}
          className="flex-1"
        >
          <button className="w-full flex justify-center items-center gap-2 bg-white border border-cyan-600 text-cyan-600 py-3 rounded-xl hover:bg-cyan-50 transition">

            <FaArrowRight />

            Details

          </button>
        </Link>

        <Link
          to={`/tests/${test._id}/attempt`}
          className="flex-1"
        >
          <button className="w-full flex justify-center items-center gap-2 bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-700 transition">

            <FaPlayCircle />

            Start

          </button>
        </Link>

      </div>

    </div>
  );
};

export default TestCard;