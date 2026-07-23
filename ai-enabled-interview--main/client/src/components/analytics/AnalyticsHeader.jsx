// src/components/analytics/AnalyticsHeader.jsx

import { FaChartLine, FaTrophy, FaCalendarAlt } from "react-icons/fa";

const AnalyticsHeader = ({ analytics }) => {
  // Calculate Level from Total Score
  const level = Math.floor((analytics?.totalScore || 0) / 500) + 1;

  // Format Updated Date
  const updatedDate = analytics?.updatedAt
    ? new Date(analytics.updatedAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl border border-blue-500/20 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-white">
        <FaTrophy size={200} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
            <FaChartLine className="text-cyan-200" />
            Analytics Dashboard
          </h2>
          <p className="text-blue-100 mt-2 text-lg">
            Track your learning journey, contest performance, and unlockable achievements.
          </p>

          <div className="flex flex-wrap gap-8 mt-6">
            <div>
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider block">
                Total Score
              </span>
              <span className="text-3xl font-black tracking-tight mt-1 block text-cyan-200">
                {analytics?.totalScore || 0}
              </span>
            </div>
            <div>
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider block">
                Current Level
              </span>
              <span className="text-3xl font-black tracking-tight mt-1 block text-cyan-200">
                Level {level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 text-blue-100">
          <div className="hidden md:block bg-white/10 p-3 rounded-2xl border border-white/15">
            <FaTrophy className="text-yellow-300" size={36} />
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <FaCalendarAlt className="text-cyan-300" />
            <span>Updated: {updatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;