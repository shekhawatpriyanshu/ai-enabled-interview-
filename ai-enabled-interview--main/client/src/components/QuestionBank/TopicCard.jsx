import { Link } from "react-router-dom";

const TopicCard = ({ topic }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-5 border border-gray-100">

      {/* Topic Name */}
      <h2 className="text-xl font-bold text-gray-800">
        {topic.name}
      </h2>

      {/* Description */}
      {topic.description && (
        <p className="text-sm text-gray-500 mt-1">
          {topic.description}
        </p>
      )}

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">

        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-semibold text-gray-800">
            {topic.totalQuestions || 0}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-green-600">Easy</p>
          <p className="font-semibold text-green-700">
            {topic.easyCount || 0}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-2">
          <p className="text-xs text-yellow-600">Medium</p>
          <p className="font-semibold text-yellow-700">
            {topic.mediumCount || 0}
          </p>
        </div>

      </div>

      {/* Hard count */}
      <div className="mt-2 bg-red-50 rounded-lg p-2 text-center">
        <p className="text-xs text-red-600">Hard</p>
        <p className="font-semibold text-red-700">
          {topic.hardCount || 0}
        </p>
      </div>

      {/* Button */}
      <Link
        to={`/question-bank/questions?topic=${topic._id}`}
        className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
      >
        View Questions
      </Link>

    </div>
  );
};

export default TopicCard;