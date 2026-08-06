import {
  FaTrophy,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
  FaCode,
} from "react-icons/fa";

const ContestStats = ({ contests = [] }) => {
  const totalContests = contests.length;

  const upcomingContests = contests.filter(
    (contest) => contest.status === "Upcoming"
  ).length;

  const liveContests = contests.filter(
    (contest) => contest.status === "Live"
  ).length;

  const completedContests = contests.filter(
    (contest) => contest.status === "Completed"
  ).length;

  const totalProblems = contests.reduce(
    (total, contest) => total + (contest.problems?.length || 0),
    0
  );

  const stats = [
    {
      title: "Total Contests",
      value: totalContests,
      icon: <FaTrophy />,
      bg: "bg-gradient-to-br from-cyan-50/90 via-blue-50/40 to-white hover:from-cyan-100/90 hover:to-blue-50",
      border: "border-cyan-200/90 hover:border-cyan-400",
      iconBg: "bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30",
      titleColor: "group-hover:text-cyan-600",
      numberColor: "from-cyan-600 to-blue-600",
    },
    {
      title: "Upcoming Contests",
      value: upcomingContests,
      icon: <FaClock />,
      bg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white hover:from-amber-100/90 hover:to-orange-50",
      border: "border-amber-200/90 hover:border-amber-400",
      iconBg: "bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-amber-500/30",
      titleColor: "group-hover:text-amber-600",
      numberColor: "from-amber-600 to-orange-600",
    },
    {
      title: "Live Contests",
      value: liveContests,
      icon: <FaPlayCircle />,
      bg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white hover:from-emerald-100/90 hover:to-teal-50",
      border: "border-emerald-200/90 hover:border-emerald-400",
      iconBg: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30",
      titleColor: "group-hover:text-emerald-600",
      numberColor: "from-emerald-600 to-teal-600",
    },
    {
      title: "Completed Contests",
      value: completedContests,
      icon: <FaCheckCircle />,
      bg: "bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white hover:from-purple-100/90 hover:to-fuchsia-50",
      border: "border-purple-200/90 hover:border-purple-400",
      iconBg: "bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-purple-500/30",
      titleColor: "group-hover:text-purple-600",
      numberColor: "from-purple-600 to-fuchsia-600",
    },
    {
      title: "Problems Used",
      value: totalProblems,
      icon: <FaCode />,
      bg: "bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white hover:from-rose-100/90 hover:to-pink-50",
      border: "border-rose-200/90 hover:border-rose-400",
      iconBg: "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white shadow-rose-500/30",
      titleColor: "group-hover:text-rose-600",
      numberColor: "from-rose-600 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl border ${item.border} ${item.bg} p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between gap-3`}
        >
          {/* Top Row: Icon + Value */}
          <div className="flex items-center justify-between gap-2">
            <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center text-lg shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${item.numberColor} bg-clip-text text-transparent`}>
              {item.value}
            </h2>
          </div>

          {/* Bottom Row: Full Untruncated Title */}
          <div>
            <p className={`text-xs font-black uppercase tracking-wide text-slate-600 ${item.titleColor} transition-colors leading-snug break-words`}>
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContestStats;