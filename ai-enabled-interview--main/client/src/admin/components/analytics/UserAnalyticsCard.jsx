import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { FaUsers, FaUserCheck, FaUserSlash, FaUserShield, FaUserClock, FaUserPlus } from "react-icons/fa";
ChartJS.register(ArcElement, Tooltip, Legend);

const UserAnalyticsCard = ({ analytics }) => {
  if (!analytics) return null;

  const chartData = {
    labels: ["Verified", "Unverified", "Blocked"],
    datasets: [
      {
        data: [
          analytics.verifiedUsers || 0,
          analytics.unverifiedUsers || 0,
          analytics.blockedUsers || 0,
        ],
        backgroundColor: ["#3b82f6", "#f97316", "#ef4444"],
        borderColor: ["#2563eb", "#ea580c", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  return (

    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">
          <FaUsers />
        </div>
        User Analytics Breakdown
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4 my-3">
          <div className="border border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUsers className="text-blue-500" /> Total Users
            </p>
            <h3 className="text-3xl font-black text-blue-700 mt-1">
              {analytics.totalUsers || 0}
            </h3>
          </div>

          <div className="border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUserCheck className="text-emerald-500" /> Active Users
            </p>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">
              {analytics.activeUsers || 0}
            </h3>
          </div>

          <div className="border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-red-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUserSlash className="text-rose-500" /> Blocked Users
            </p>
            <h3 className="text-3xl font-black text-rose-700 mt-1">
              {analytics.blockedUsers || 0}
            </h3>
          </div>

          <div className="border border-cyan-200/80 bg-gradient-to-br from-cyan-50/80 to-blue-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUserShield className="text-cyan-500" /> Verified Users
            </p>
            <h3 className="text-3xl font-black text-cyan-700 mt-1">
              {analytics.verifiedUsers || 0}
            </h3>
          </div>

          <div className="border border-orange-200/80 bg-gradient-to-br from-orange-50/80 to-amber-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUserClock className="text-orange-500" /> Unverified Users
            </p>
            <h3 className="text-3xl font-black text-orange-700 mt-1">
              {analytics.unverifiedUsers || 0}
            </h3>
          </div>

          <div className="border border-purple-200/80 bg-gradient-to-br from-purple-50/80 to-indigo-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUserPlus className="text-purple-500" /> New Users (7 Days)
            </p>
            <h3 className="text-3xl font-black text-purple-700 mt-1">
              {analytics.newUsers || 0}
            </h3>
          </div>
        </div>

        {/* Right Side: Doughnut Chart */}
        <div className="h-64 flex justify-center items-center relative lg:h-full">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsCard;