import { motion } from "framer-motion";

const colorStyles = {
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/15",
    iconBg: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-blue-500/30",
    topLine: "from-blue-500 to-indigo-600",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/15",
    iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
    topLine: "from-emerald-500 to-teal-600",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/15",
    iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/30",
    topLine: "from-amber-500 to-orange-600",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/60 border-rose-200/90 hover:border-rose-400 hover:shadow-rose-500/15",
    iconBg: "bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-rose-500/30",
    topLine: "from-rose-500 to-pink-600",
  },
  cyan: {
    cardBg: "bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/60 border-cyan-200/90 hover:border-cyan-400 hover:shadow-cyan-500/15",
    iconBg: "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30",
    topLine: "from-cyan-500 to-blue-600",
  },
  indigo: {
    cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/15",
    iconBg: "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-indigo-500/30",
    topLine: "from-indigo-500 to-purple-600",
  },
};

const StatCard = ({ title, value, icon, color = "blue", index = 0 }) => {
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.025 }}
      className={`group border rounded-3xl p-6 text-center shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden ${style.cardBg}`}
    >
      {/* Top Accent Gradient Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.topLine}`} />

      <div>
        {/* Icon Container */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${style.iconBg}`}
        >
          {icon}
        </div>

        {/* Value */}
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-4 group-hover:text-indigo-600 transition-colors">
          {value}
        </h2>
      </div>

      {/* Title */}
      <p className="text-slate-600 text-xs font-black uppercase tracking-wider mt-2">
        {title}
      </p>
    </motion.div>
  );
};

export default StatCard;