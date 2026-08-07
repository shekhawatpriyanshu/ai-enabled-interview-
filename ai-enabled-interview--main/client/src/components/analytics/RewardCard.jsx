import { FaAward, FaCalendarAlt, FaTrophy, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const RewardCard = ({ reward, index = 0 }) => {
  const badge = reward?.badge;
  const achievement = reward?.achievement;

  const earnedDate = reward?.createdAt
    ? new Date(reward.createdAt).toLocaleDateString("en-US", {
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
      className="group bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 border border-amber-200/90 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden text-slate-800"
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400" />

      <div>
        {/* Badge Info */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg shadow-amber-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            {badge?.icon ? (
              <span>{badge.icon}</span>
            ) : (
              <FaAward size={36} />
            )}
          </div>

          <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
            {badge?.title || "Unlockable Achievement Badge"}
          </h4>

          <p className="text-slate-600 text-xs font-semibold mt-1.5 leading-relaxed px-2">
            {badge?.description || "Successfully unlocked reward for active platform participation."}
          </p>
        </div>

        <div className="border-t border-slate-100 my-4" />

        {/* Achievement Info */}
        {achievement && (
          <div className="mb-4 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-800 font-black text-xs mb-1">
              <FaTrophy className="text-amber-500 text-xs" />
              <span>Achievement Unlocked</span>
            </div>

            <div>
              <h6 className="text-slate-900 font-extrabold text-xs">
                {achievement.title}
              </h6>
              <span className="text-slate-500 text-[11px] font-semibold mt-0.5 block leading-relaxed">
                {achievement.description}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="border-t border-slate-100 my-3" />

        {/* Earned Date / Status */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-black uppercase tracking-wider shadow-2xs flex items-center gap-1">
            <FaStar className="text-amber-500 text-xs" />
            Earned Reward
          </span>

          <span className="flex items-center gap-1.5 text-slate-500 font-bold">
            <FaCalendarAlt className="text-slate-400 text-xs" />
            {earnedDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardCard;