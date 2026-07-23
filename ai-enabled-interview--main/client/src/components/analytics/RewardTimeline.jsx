// src/components/analytics/RewardTimeline.jsx

import {
  FaAward,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

const RewardTimeline = ({ rewards = [] }) => {
  // Show newest rewards first
  const sortedRewards = [...rewards].sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mt-8">
      
      <h4 className="text-xl font-bold text-slate-800 mb-6">
        🕒 Reward Timeline
      </h4>

      {sortedRewards.length === 0 ? (
        <div className="text-center text-slate-400 py-6">
          No rewards earned yet.
        </div>
      ) : (
        <div className="relative">

          {sortedRewards.map((reward, index) => (
            <div
              key={reward._id}
              className="flex mb-6 last:mb-0 position-relative"
            >
              {/* Timeline graphic */}
              <div className="flex flex-col align-items-center mr-4 w-10">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-sm shadow-sm">
                  {reward.badge?.icon ? (
                    <span className="text-base">{reward.badge.icon}</span>
                  ) : (
                    <FaAward />
                  )}
                </div>

                {index !== sortedRewards.length - 1 && (
                  <div className="w-0.5 bg-slate-200 flex-1 my-2 min-h-[80px]" />
                )}
              </div>

              {/* Content box */}
              <div className="flex-1">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all duration-300">
                  
                  <div className="flex justify-between items-start md:items-center flex-wrap gap-2">
                    <h5 className="text-base font-bold text-slate-800">
                      {reward.badge?.title || "Reward"}
                    </h5>

                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FaCalendarAlt />
                      {reward.createdAt
                        ? new Date(reward.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {reward.badge?.description || "Badge earned"}
                  </p>

                  {reward.achievement && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-700 font-semibold bg-white border border-slate-100/80 px-3 py-1.5 rounded-xl w-fit">
                      <FaTrophy className="text-amber-500" />
                      <span>{reward.achievement.title}</span>
                    </div>
                  )}

                </div>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default RewardTimeline;