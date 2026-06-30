// src/components/analytics/BadgeCard.jsx

import { FaAward, FaCalendarAlt } from "react-icons/fa";

const BadgeCard = ({ badge }) => {
  const createdDate = badge?.createdAt
    ? new Date(badge.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
      <div>
        {/* Badge Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm shadow-amber-500/10">
          {badge?.icon ? (
            <span>{badge.icon}</span>
          ) : (
            <FaAward className="text-warning" />
          )}
        </div>

        {/* Badge Title */}
        <h4 className="text-lg font-bold text-slate-800">
          {badge.title}
        </h4>

        {/* Description */}
        <p className="text-slate-500 text-sm mt-2 leading-relaxed px-2">
          {badge.description}
        </p>
      </div>

      <div>
        <div className="border-t border-slate-100 my-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs">
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
            Available
          </span>

          <span className="flex items-center gap-1.5 text-slate-400">
            <FaCalendarAlt />
            {createdDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;