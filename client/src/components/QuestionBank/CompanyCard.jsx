import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-5 border border-gray-100">

      {/* Company Name */}
      <h2 className="text-xl font-bold text-gray-800">
        {company.name}
      </h2>

      {/* Optional Description */}
      {company.description && (
        <p className="text-sm text-gray-500 mt-1">
          {company.description}
        </p>
      )}

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-center">

        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Total Questions</p>
          <p className="font-semibold text-gray-800">
            {company.totalQuestions || 0}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-blue-600">Topics Covered</p>
          <p className="font-semibold text-blue-700">
            {company.topicCount || 0}
          </p>
        </div>

      </div>

      {/* Difficulty Breakdown */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">

        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-green-600">Easy</p>
          <p className="font-semibold text-green-700">
            {company.easyCount || 0}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-2">
          <p className="text-xs text-yellow-600">Medium</p>
          <p className="font-semibold text-yellow-700">
            {company.mediumCount || 0}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-2">
          <p className="text-xs text-red-600">Hard</p>
          <p className="font-semibold text-red-700">
            {company.hardCount || 0}
          </p>
        </div>

      </div>

      {/* Button */}
      <Link
        to={`/question-bank/questions?company=${company._id}`}
        className="mt-4 block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
      >
        View Questions
      </Link>

    </div>
  );
};

export default CompanyCard;