import React from "react";

const StatsCard = ({ title, value, icon, bgGradient, iconBg, textClass, borderColor }) => {
  return (
    <div className={`rounded-3xl border p-5 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1.5 relative overflow-hidden ${bgGradient || "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40"} ${borderColor || "border-indigo-200/90 hover:border-purple-300"}`}>
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

      {/* Top Row: Icon */}
      {icon && (
        <div className="flex items-center justify-between mb-3 pt-1">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ${iconBg || "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/30"}`}>
            {icon}
          </div>
        </div>
      )}

      {/* Bottom Row: Full Title & Big Value */}
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 leading-snug">
          {title}
        </p>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textClass || "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"}`}>
          {value || 0}
        </h2>
      </div>
    </div>
  );
};

export default StatsCard;