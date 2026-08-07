import { FaChartLine, FaTrophy, FaCalendarAlt, FaFire, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const AnalyticsHeader = ({ analytics }) => {
  // Calculate Level from Total Score
  const level = Math.floor((analytics?.totalScore || 0) / 500) + 1;

  // Format Updated Date
  const updatedDate = analytics?.updatedAt
    ? new Date(analytics.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-indigo-600 via-purple-600 via-fuchsia-600 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20 border border-white/20 relative overflow-hidden z-10"
    >
      {/* Background Decor Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-white">
        <FaTrophy size={220} />
      </div>

      {/* Top Accent Light Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-white to-cyan-300" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <FaFire className="text-amber-300 animate-bounce" />
            <span>User Performance & Analytics</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
            <FaChartLine className="text-cyan-300" />
            <span>User Analytics Dashboard</span>
          </h2>

          <p className="text-purple-100 text-xs sm:text-sm font-semibold max-w-xl">
            Track your interview performance, coding challenge solutions, contest achievements, and level progression.
          </p>

          {/* Stats Metrics Badges */}
          <div className="flex flex-wrap gap-6 pt-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-xs">
              <span className="text-purple-200 text-[10px] font-black uppercase tracking-wider block">
                Total Platform Score
              </span>
              <span className="text-2xl font-black text-cyan-200 flex items-center gap-1.5 mt-0.5">
                <FaStar className="text-amber-300 text-lg" />
                {analytics?.totalScore || 0}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-xs">
              <span className="text-purple-200 text-[10px] font-black uppercase tracking-wider block">
                Current Skill Rank
              </span>
              <span className="text-2xl font-black text-cyan-200 flex items-center gap-1.5 mt-0.5">
                <FaTrophy className="text-yellow-300 text-lg" />
                Level {level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="hidden md:flex w-16 h-16 bg-white/15 backdrop-blur-md rounded-3xl border border-white/20 items-center justify-center text-3xl shadow-lg">
            <FaTrophy className="text-amber-300 drop-shadow-md animate-pulse" />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-purple-100 shadow-inner">
            <FaCalendarAlt className="text-cyan-300 text-xs" />
            <span>Updated: {updatedDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;