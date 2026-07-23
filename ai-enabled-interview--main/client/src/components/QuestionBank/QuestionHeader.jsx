import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
} from "lucide-react";

const QuestionHeader = ({
  title = "Question Bank",
  subtitle = "Practice interview questions by topic, company, and difficulty.",
  showButton = false,
  buttonText = "Add Question",
  buttonLink = "/question-bank/questions/create",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <BookOpen size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {title}
            </h1>

            <p className="text-gray-500 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right */}
        {showButton && (
          <Link
            to={buttonLink}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            <Plus size={18} />
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuestionHeader;