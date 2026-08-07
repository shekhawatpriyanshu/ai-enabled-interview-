import {
  FaLock,
  FaUnlock,
  FaTrophy,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

const categoryStyles = {
  questions: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/15",
    iconBg: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-blue-500/30",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    bar: "bg-gradient-to-r from-blue-500 to-indigo-600",
    topLine: "from-blue-500 to-indigo-600",
  },
  coding: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/15",
    iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-600",
    topLine: "from-emerald-500 to-teal-600",
  },
  tests: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/15",
    iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/30",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    bar: "bg-gradient-to-r from-amber-500 to-orange-500",
    topLine: "from-amber-500 to-orange-600",
  },
  contests: {
    cardBg: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/60 border-rose-200/90 hover:border-rose-400 hover:shadow-rose-500/15",
    iconBg: "bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-rose-500/30",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
    bar: "bg-gradient-to-r from-rose-500 to-pink-600",
    topLine: "from-rose-500 to-pink-600",
  },
  interviews: {
    cardBg: "bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/60 border-cyan-200/90 hover:border-cyan-400 hover:shadow-cyan-500/15",
    iconBg: "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30",
    badge: "bg-cyan-100 text-cyan-800 border-cyan-300",
    bar: "bg-gradient-to-r from-cyan-500 to-blue-600",
    topLine: "from-cyan-500 to-blue-600",
  },
  default: {
    cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/15",
    iconBg: "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-indigo-500/30",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
    bar: "bg-gradient-to-r from-indigo-500 to-purple-600",
    topLine: "from-indigo-500 to-purple-600",
  },
};

const AchievementCard = ({
  achievement,
  progress = 0,
  index = 0,
}) => {
  const percentage = Math.min(
    Math.round((progress / achievement.target) * 100),
    100
  );

  const unlocked = progress >= achievement.target;
  const style = categoryStyles[achievement.category] || categoryStyles.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.025 }}
      className={`group border rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden text-slate-800 ${style.cardBg}`}
    >
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.topLine}`} />

      <div>
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${style.iconBg}`}
          >
            <FaTrophy />
          </div>

          {unlocked ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <FaUnlock className="text-emerald-600 text-xs" />
              Unlocked
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <FaLock className="text-slate-400 text-xs" />
              Locked
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
          {achievement.title}
        </h4>

        <p className="text-slate-600 text-xs font-semibold mt-1.5 leading-relaxed">
          {achievement.description}
        </p>

        {/* Category Tag */}
        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border mt-3 inline-block shadow-2xs ${style.badge}`}>
          {achievement.category}
        </span>
      </div>

      {/* Progress & Fill */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
          <span>Progress</span>
          <span className="font-black text-slate-900">
            {progress} / {achievement.target}
          </span>
        </div>

        <div className="w-full bg-slate-200/60 rounded-full h-2.5 p-0.5 border border-slate-200/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-1.5 rounded-full ${style.bar}`}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/60 text-xs font-bold text-slate-500">
          <span>{percentage}% Completed</span>
          {unlocked && (
            <FaCheckCircle className="text-emerald-500 text-sm" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;