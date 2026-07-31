import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer group">
      <h4 className="text-slate-500 text-sm font-medium">
        {title}
      </h4>
      <h2 className="text-3xl font-bold mt-2 text-slate-800">
        {value}
      </h2>
    </div>
  );
};

export default StatsCard;