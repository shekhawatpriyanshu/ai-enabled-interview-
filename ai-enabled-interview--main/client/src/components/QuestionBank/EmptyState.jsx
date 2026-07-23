import { Link } from "react-router-dom";
import {
  FolderOpen,
  PlusCircle,
} from "lucide-react";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display right now.",
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center justify-center text-center">

      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <FolderOpen
          size={40}
          className="text-gray-400"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="text-gray-500 mt-3 max-w-md">
        {description}
      </p>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
        >
          <PlusCircle size={18} />
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;