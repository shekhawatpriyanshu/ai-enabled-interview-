const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Easy: "bg-green-100 text-green-700 border border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Hard: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        styles[difficulty] ||
        "bg-gray-100 text-gray-700 border border-gray-200"
      }`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;