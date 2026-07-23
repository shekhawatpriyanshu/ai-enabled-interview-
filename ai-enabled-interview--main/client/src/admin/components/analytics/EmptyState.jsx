const EmptyState = ({
  title = "No Data Found",
  message = "There is no analytics data available.",
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-12 text-center">

      <div className="text-7xl mb-5">
        📊
      </div>

      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-3">
        {message}
      </p>

    </div>
  );
};

export default EmptyState;