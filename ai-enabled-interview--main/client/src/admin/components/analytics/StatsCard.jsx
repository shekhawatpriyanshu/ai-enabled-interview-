import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
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