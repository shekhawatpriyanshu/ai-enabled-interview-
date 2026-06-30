import { Link } from "react-router-dom";
import { FaCode, FaArrowLeft } from "react-icons/fa";

const EmptyState = ({
  title = "Nothing Found",
  description = "There is no data available.",
  buttonText = "Go Back",
  buttonLink = "/coding",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-12 text-center">

      <div className="w-24 h-24 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">

        <FaCode className="text-5xl text-cyan-600" />

      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="mt-3 text-gray-500 max-w-lg mx-auto leading-7">
        {description}
      </p>

      <Link
        to={buttonLink}
        className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition"
      >
        <FaArrowLeft />
        {buttonText}
      </Link>

    </div>
  );
};

export default EmptyState;