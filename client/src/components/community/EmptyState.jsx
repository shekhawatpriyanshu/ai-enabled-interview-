import { Link } from "react-router-dom";
import {
  Inbox,
  PlusCircle,
} from "lucide-react";

const EmptyState = ({
  title = "Nothing Here Yet",
  description = "No data available.",
  buttonText,
  buttonLink,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-10">

      <div className="flex flex-col items-center text-center">

        {/* Icon */}

        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <Icon
            size={50}
            className="text-blue-600"
          />
        </div>

        {/* Title */}

        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>

        {/* Description */}

        <p className="text-gray-500 mt-3 max-w-lg">
          {description}
        </p>

        {/* Button */}

        {buttonText && buttonLink && (
          <Link
            to={buttonLink}
            className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            <PlusCircle size={20} />

            {buttonText}
          </Link>
        )}

      </div>

    </div>
  );
};

export default EmptyState;