import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = ({
  title = "No Data Found",
  message = "Nothing is available right now.",
  showButton = true,
  buttonText = "Go Back",
  buttonLink = "/",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">

      {/* Icon */}
      <Trophy size={60} className="text-gray-300" />

      {/* Title */}
      <h2 className="text-2xl font-bold mt-4 text-gray-800">
        {title}
      </h2>

      {/* Message */}
      <p className="text-gray-500 mt-2 max-w-md">
        {message}
      </p>

      {/* Button */}
      {showButton && (
        <Link
          to={buttonLink}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {buttonText}
        </Link>
      )}

    </div>
  );
};

export default EmptyState;