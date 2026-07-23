import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

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
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        User Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {analytics.totalUsers}
            </h3>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Active Users</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {analytics.activeUsers}
            </h3>
          </div>

          <div className="border border-red-100 bg-red-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Blocked Users</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {analytics.blockedUsers}
            </h3>
          </div>

          <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Verified Users</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {analytics.verifiedUsers}
            </h3>
          </div>

          <div className="border border-orange-100 bg-orange-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Unverified Users</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-1">
              {analytics.unverifiedUsers}
            </h3>
          </div>

          <div className="border border-purple-100 bg-purple-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">New Users (7 Days)</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {analytics.newUsers}
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