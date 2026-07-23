const ErrorCard = ({
  title = "Something went wrong",
  message = "Unable to load analytics.",
}) => {
  return (
    <div className="bg-red-50 border border-red-300 rounded-xl p-10 text-center">

      <div className="text-6xl mb-5">
        ⚠️
      </div>

      <h2 className="text-2xl font-bold text-red-700">
        {title}
      </h2>

      <p className="text-red-600 mt-3">
        {message}
      </p>

    </div>
  );
};

export default ErrorCard;