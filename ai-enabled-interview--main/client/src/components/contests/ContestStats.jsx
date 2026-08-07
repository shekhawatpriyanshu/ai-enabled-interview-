import { FileCode2, Clock3, Trophy, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const cardStyles = [
  {
    card: "bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border-blue-200 hover:border-blue-400 hover:shadow-blue-500/15 border-t-4 border-t-blue-500",
    iconBg: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-blue-500/25",
  },
  {
    card: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-500/15 border-t-4 border-t-emerald-500",
    iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/25",
  },
  {
    card: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 border-amber-200 hover:border-amber-400 hover:shadow-amber-500/15 border-t-4 border-t-amber-500",
    iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/25",
  },
  {
    card: "bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/60 border-purple-200 hover:border-purple-400 hover:shadow-purple-500/15 border-t-4 border-t-purple-500",
    iconBg: "bg-gradient-to-tr from-purple-500 to-fuchsia-600 text-white shadow-purple-500/25",
  },
];

const ContestStats = ({ contest }) => {
  const stats = [
    {
      title: "Total Challenges",
      value: `${contest.problems?.length || 0} Problems`,
      icon: FileCode2,
    },
    {
      title: "Session Duration",
      value: `${contest.duration} Mins`,
      icon: Clock3,
    },
    {
      title: "Contest Status",
      value: contest.status || "Upcoming",
      icon: Trophy,
    },
    {
      title: "Start Date",
      value: new Date(contest.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        const style = cardStyles[index % cardStyles.length];

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4 text-slate-800 ${style.card}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}
              >
                <Icon size={22} />
              </div>

              <div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">
                  {item.title}
                </span>
                <span className="text-lg font-black text-slate-900 tracking-tight block mt-0.5 group-hover:text-indigo-600 transition-colors">
                  {item.value}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ContestStats;