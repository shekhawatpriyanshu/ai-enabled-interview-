// src/components/analytics/RewardCard.jsx

import {
  FaAward,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";

const RewardCard = ({ reward }) => {
  const badge = reward?.badge;
  const achievement = reward?.achievement;

  const earnedDate = reward?.createdAt
    ? new Date(reward.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
      <div>
        {/* Badge info */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm shadow-amber-500/10">
            {badge?.icon ? (
              <span>{badge.icon}</span>
            ) : (
              <FaAward size={32} />
            )}
          </div>

          <h4 className="text-lg font-bold text-slate-800">
            {badge?.title || "No Badge"}
          </h4>

          <p className="text-slate-500 text-sm mt-1 leading-relaxed px-2">
            {badge?.description || "No description"}
          </p>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* Achievement info */}
        {achievement && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-2">
              <FaTrophy className="text-emerald-500" />
              <span>Achievement Linked</span>
            </div>

            <div className="pl-6">
              <h6 className="text-slate-800 font-semibold text-sm">
                {achievement.title}
              </h6>
              <span className="text-slate-500 text-xs mt-0.5 block leading-relaxed">
                {achievement.description}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="border-t border-slate-100 my-4"></div>

        {/* Earned Date / Status */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
            Earned
          </span>

          <span className="flex items-center gap-1.5 text-slate-400">
            <FaCalendarAlt />
            {earnedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;