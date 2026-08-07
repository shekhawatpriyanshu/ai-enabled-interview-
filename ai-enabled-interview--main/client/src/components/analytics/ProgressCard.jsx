import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const progressStyles = {
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 border-blue-200/90 hover:border-blue-400 hover:shadow-blue-500/10",
    barGrad: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/10",
    barGrad: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/10",
    barGrad: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-50/80 via-white to-pink-50/40 border-rose-200/90 hover:border-rose-400 hover:shadow-rose-500/10",
    barGrad: "bg-gradient-to-r from-rose-500 to-pink-600",
  },
  cyan: {
    cardBg: "bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/40 border-cyan-200/90 hover:border-cyan-400 hover:shadow-cyan-500/10",
    barGrad: "bg-gradient-to-r from-cyan-500 to-blue-600",
  },
  indigo: {
    cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/10",
    barGrad: "bg-gradient-to-r from-indigo-500 to-purple-600",
  },
};

const ProgressCard = ({
  title,
  value = 0,
  target = 100,
  color = "blue",
}) => {
  // Prevent divide by zero
  const percentage =
    target > 0
      ? Math.min(Math.round((value / target) * 100), 100)
      : 0;

  const completed = value >= target;
  const style = progressStyles[color] || progressStyles.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -3 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 group ${style.cardBg}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h6 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
          {title}
        </h6>

        {completed ? (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <FaCheckCircle className="text-emerald-600 text-xs" />
            Completed
          </span>
        ) : (
          <span className="bg-white/90 text-slate-700 border border-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
            {percentage}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/60 rounded-full h-2.5 p-0.5 border border-slate-200/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-1.5 rounded-full ${style.barGrad}`}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-3 text-xs font-semibold text-slate-600">
        <span>
          <strong className="text-slate-900 font-black">{value}</strong> completed
        </span>

        <span className="font-bold text-slate-600">
          Target Goal: <strong className="text-slate-900 font-black">{target}</strong>
        </span>
      </div>
    </motion.div>
  );
};

export default ProgressCard;