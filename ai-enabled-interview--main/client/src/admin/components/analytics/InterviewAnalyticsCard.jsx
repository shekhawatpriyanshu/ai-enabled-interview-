import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Card = ({ title, value, color, bgColor }) => (
  <div className={`border border-gray-100 ${bgColor || "bg-gray-50/50"} rounded-2xl p-4`}>
    <p className="text-gray-500 text-sm font-medium">
      {title}
    </p>
    <h3 className={`text-3xl font-extrabold mt-1 ${color}`}>
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
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Interview Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            title="Total Interviews"
            value={analytics.totalInterviews}
            color="text-slate-900"
            bgColor="bg-slate-50/50 border-slate-100"
          />

          <Card
            title="Completed"
            value={analytics.completed}
            color="text-emerald-600"
            bgColor="bg-emerald-50/30 border-emerald-100"
          />

          <Card
            title="Pending"
            value={analytics.pending}
            color="text-yellow-600"
            bgColor="bg-yellow-50/30 border-yellow-100"
          />

          <Card
            title="Cancelled"
            value={analytics.cancelled}
            color="text-red-600"
            bgColor="bg-red-50/30 border-red-100"
          />

          <Card
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            color="text-purple-600"
            bgColor="bg-purple-50/30 border-purple-100"
          />

          <Card
            title="Average Score"
            value={analytics.averageScore}
            color="text-indigo-600"
            bgColor="bg-indigo-50/30 border-indigo-100"
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