import { FaAward, FaCalendarAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const BadgeCard = ({ badge, index = 0 }) => {
  const createdDate = badge?.createdAt
    ? new Date(badge.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group bg-gradient-to-br from-purple-50/90 via-white to-cyan-50/50 border border-purple-200/90 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-purple-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden text-slate-800"
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500" />

      <div>
        {/* Badge Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {badge?.icon ? (
            <span>{badge.icon}</span>
          ) : (
            <FaAward size={36} />
          )}
        </div>

        {/* Badge Title */}
        <h4 className="text-lg font-black text-slate-900 tracking-tight text-center group-hover:text-purple-600 transition-colors">
          {badge.title || "Achievement Badge"}
        </h4>

        {/* Description */}
        <p className="text-slate-600 text-xs font-semibold mt-1.5 leading-relaxed px-2 text-center">
          {badge.description || "Earned badge for platform participation and milestone completion."}
        </p>
      </div>

      <div>
        <div className="border-t border-slate-100 my-4" />

        {/* Footer */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-black uppercase tracking-wider shadow-2xs flex items-center gap-1">
            <FaStar className="text-purple-500 text-xs" />
            Badge Unlocked
          </span>

          <span className="flex items-center gap-1.5 text-slate-500 font-bold">
            <FaCalendarAlt className="text-slate-400 text-xs" />
            {createdDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BadgeCard;