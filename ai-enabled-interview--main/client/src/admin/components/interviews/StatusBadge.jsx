const StatusBadge = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-emerald-500/10";

      case "Started":
        return "bg-amber-50 text-amber-700 border-amber-200/90 shadow-amber-500/10";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${getStatusClasses()}`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
          status === "Completed"
            ? "bg-emerald-500"
            : status === "Started"
            ? "bg-amber-500"
            : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;