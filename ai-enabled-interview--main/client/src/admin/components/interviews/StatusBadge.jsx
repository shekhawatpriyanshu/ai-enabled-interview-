const StatusBadge = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-300";

      case "Started":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";

      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses()}`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${
          status === "Completed"
            ? "bg-green-500"
            : status === "Started"
            ? "bg-yellow-500"
            : "bg-gray-500"
        }`}
      />

      {status}
    </span>
  );
};

export default StatusBadge;