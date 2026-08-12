import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { FaUserTie } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const Card = ({ title, value, color, bgColor, borderColor }) => (
  <div className={`border ${borderColor || "border-slate-200/80"} ${bgColor || "bg-slate-50/50"} rounded-2xl p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
      {title}
    </p>
    <h3 className={`text-3xl font-black mt-1 ${color}`}>
      {value}
    </h3>
  </div>
);

const InterviewAnalyticsCard = ({ analytics }) => {
  if (!analytics) return null;

  const chartData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          analytics.completed || 0,
          analytics.pending || 0,
          analytics.cancelled || 0,
        ],
        backgroundColor: ["#10b981", "#eab308", "#ef4444"],
        borderColor: ["#059669", "#ca8a04", "#dc2626"],
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
      <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm">
          <FaUserTie />
        </div>
        Interview Performance Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            title="Total Interviews"
            value={analytics.totalInterviews || 0}
            color="text-slate-800"
            bgColor="bg-gradient-to-br from-slate-50 to-blue-50/30"
            borderColor="border-slate-200"
          />

          <Card
            title="Completed"
            value={analytics.completed || 0}
            color="text-emerald-700"
            bgColor="bg-gradient-to-br from-emerald-50/80 to-teal-50/40"
            borderColor="border-emerald-200/80"
          />

          <Card
            title="Pending"
            value={analytics.pending || 0}
            color="text-amber-700"
            bgColor="bg-gradient-to-br from-amber-50/80 to-yellow-50/40"
            borderColor="border-amber-200/80"
          />



          <Card
            title="Completion Rate"
            value={`${analytics.completionRate || 0}%`}
            color="text-purple-700"
            bgColor="bg-gradient-to-br from-purple-50/80 to-indigo-50/40"
            borderColor="border-purple-200/80"
          />

          <Card
            title="Average Score"
            value={analytics.averageScore || 0}
            color="text-indigo-700"
            bgColor="bg-gradient-to-br from-indigo-50/80 to-blue-50/40"
            borderColor="border-indigo-200/80"
          />
        </div>

        {/* Right Side: Doughnut Chart */}
        <div className="h-64 flex justify-center items-center relative lg:h-full">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Progress Bars Summary */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 mt-8">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">
          Performance Summary
        </h3>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
              <span>Completion Rate</span>
              <span className="text-slate-900 font-bold">
                {analytics.completionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${analytics.completionRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
              <span>Average Score</span>
              <span className="text-slate-900 font-bold">
                {analytics.averageScore}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${analytics.averageScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalyticsCard;