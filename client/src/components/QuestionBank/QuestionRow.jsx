import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge";

const QuestionRow = ({ question }) => {
    console.log(question);
  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* Title */}
      <td className="px-4 py-3 font-medium text-gray-800">
        {question.title}
      </td>

      {/* Difficulty */}
      <td className="px-4 py-3">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>

      {/* Topic */}
      <td className="px-4 py-3 text-gray-600">
        {question.topic?.name || "N/A"}
      </td>

      {/* Company */}
      <td className="px-4 py-3 text-gray-600">
        {question.company?.name || "N/A"}
      </td>

      {/* Tags */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {question.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Action */}
      <td className="px-4 py-3 text-right">
        <Link
          to={`/question-bank/questions/${question._id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View
        </Link>
      </td>

    </tr>
  );
};

export default QuestionRow;