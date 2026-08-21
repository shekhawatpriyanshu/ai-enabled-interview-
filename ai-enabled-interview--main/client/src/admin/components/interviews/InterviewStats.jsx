import {
  FaClipboardList,
  FaCheckCircle,
  FaPlayCircle,
  FaStar,
} from "react-icons/fa";

const InterviewStats = ({ stats }) => {
  const cards = [
    {
      title: "Total Sessions",
      value: stats?.total || 0,
      icon: <FaClipboardList />,
      gradient: "from-indigo-600 to-blue-600",
      cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border-indigo-200/80",
      topAccent: "bg-gradient-to-r from-indigo-500 to-blue-600",
      iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/25",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: <FaCheckCircle />,
      gradient: "from-emerald-600 to-teal-600",
      cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/80",
      topAccent: "bg-gradient-to-r from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/25",
    },
    {
      title: "In Progress",
      value: stats?.started || 0,
      icon: <FaPlayCircle />,
      gradient: "from-amber-600 to-orange-600",
      cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-200/80",
      topAccent: "bg-gradient-to-r from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/25",
    },
    {
      title: "Average Score",
      value:
        stats?.averageScore !== undefined &&
        stats?.averageScore !== null &&
        !isNaN(Number(stats.averageScore))
          ? `${Number(stats.averageScore).toFixed(1)}%`
          : "0%",
      icon: <FaStar />,
      gradient: "from-purple-600 to-fuchsia-600",
      cardBg: "bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/40 border-purple-200/80",
      topAccent: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
      iconBg: "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-purple-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`group ${card.cardBg} rounded-2xl border p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
        >
          {/* Glowing Top Accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${card.topAccent}`} />

          {/* Top Row: Title on Left, Icon on Right */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-sm sm:text-base shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}
            >
              {card.icon}
            </div>
          </div>

          {/* Bottom Row: Number Value */}
          <div className="mt-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
              {card.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewStats;