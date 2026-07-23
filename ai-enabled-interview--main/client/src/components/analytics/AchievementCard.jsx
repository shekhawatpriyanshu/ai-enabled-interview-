// src/components/analytics/AchievementCard.jsx

import {
  FaLock,
  FaUnlock,
  FaTrophy,
  FaCheckCircle,
} from "react-icons/fa";

const categoryClasses = {
  questions: {
    bg: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    bar: "bg-blue-600",
  },
  coding: {
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-600",
  },
  tests: {
    bg: "bg-amber-50 text-amber-600 border-amber-100",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
  },
  contests: {
    bg: "bg-rose-50 text-rose-600 border-rose-100",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
  },
  interviews: {
    bg: "bg-cyan-50 text-cyan-600 border-cyan-100",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    bar: "bg-cyan-500",
  },
  default: {
    bg: "bg-slate-50 text-slate-600 border-slate-100",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    bar: "bg-slate-500",
  },
};

const AchievementCard = ({
  achievement,
  progress = 0,
}) => {
  const percentage = Math.min(
    Math.round((progress / achievement.target) * 100),
    100
  );

  const unlocked =
    progress >= achievement.target;

  const style = categoryClasses[achievement.category] || categoryClasses.default;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border text-2xl ${style.bg}`}
          >
            <FaTrophy />
          </div>

          {unlocked ? (
            <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaUnlock size={10} />
              Unlocked
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaLock size={10} />
              Locked
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h4 className="text-lg font-bold text-slate-800">
          {achievement.title}
        </h4>

        <p className="text-slate-500 text-sm mt-1 leading-relaxed">
          {achievement.description}
        </p>

        {/* Category tag */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-3 inline-block uppercase tracking-wider ${style.badge}`}>
          {achievement.category}
        </span>
      </div>

      {/* Progress & Fill */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
          <span>Progress</span>
          <span>
            {progress} / {achievement.target}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-700 ease-out ${style.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
          <span>{percentage}% Completed</span>
          {unlocked && (
            <FaCheckCircle className="text-emerald-500" size={16} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;