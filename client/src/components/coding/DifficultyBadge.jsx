const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[difficulty] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;