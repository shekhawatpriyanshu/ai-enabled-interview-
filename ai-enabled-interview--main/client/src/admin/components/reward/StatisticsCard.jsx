const StatisticsCard = ({
  title,
  value,
  icon,
  bgGradient,
  borderColor,
  iconBg,
  textClass,
  loading = false,
}) => {
  return (
    <div className={`rounded-2xl border px-3.5 py-4 sm:px-4 sm:py-5 transition-all duration-300 cursor-pointer group flex items-start justify-between gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${bgGradient || "bg-white"} ${borderColor || "border-slate-200/80 hover:border-blue-300"}`}>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </p>

        {loading ? (
          <div className="mt-2 h-8 w-14 bg-slate-200 animate-pulse rounded-lg" />
        ) : (
          <h2 className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight truncate ${textClass || "text-slate-900"}`}>
            {value || 0}
          </h2>
        )}
      </div>

      {icon && (
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${iconBg || "bg-blue-600 text-white"}`}>
          {icon}
        </div>
      )}
    </div>
  );
};



export default StatisticsCard;