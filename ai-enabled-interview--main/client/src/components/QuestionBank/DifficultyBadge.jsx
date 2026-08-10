const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
    Medium: "bg-amber-50 text-amber-700 border-amber-200/90",
    Hard: "bg-rose-50 text-rose-700 border-rose-200/90",
  };

  const icons = {
    Easy: "🟢",
    Medium: "🟡",
    Hard: "🔴",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
        styles[difficulty] ||
        "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      <span className="text-[10px]">{icons[difficulty] || "⚪"}</span>
      {difficulty || "Normal"}
    </span>
  );
};

export default DifficultyBadge;