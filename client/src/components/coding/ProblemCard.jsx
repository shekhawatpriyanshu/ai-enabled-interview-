import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge";

const ProblemCard = ({ problem }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 p-6">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold text-gray-800">
            {problem.title}
          </h2>

          <p className="text-gray-500 mt-2">
            {problem.topic}
          </p>

        </div>

        <DifficultyBadge
          difficulty={problem.difficulty}
        />

      </div>

      <p className="mt-4 text-gray-600 line-clamp-3">
        {problem.description}
      </p>

      <div className="mt-6 flex justify-end">

        <Link
          to={`/coding/${problem._id}`}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90"
        >
          Solve Problem →
        </Link>

      </div>

    </div>
  );
};

export default ProblemCard;