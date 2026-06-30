// src/components/analytics/StatCard.jsx

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

const StatCard = ({
  title,
  value,
  icon,
  color = "blue",
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
      <div>
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-2xl border ${
            colorClasses[color] || colorClasses.blue
          }`}
        >
          {icon}
        </div>

        {/* Value */}
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-5">
          {value}
        </h2>
      </div>

      {/* Title */}
      <p className="text-slate-500 text-sm font-medium mt-2">
        {title}
      </p>
    </div>
  );
};

export default StatCard;