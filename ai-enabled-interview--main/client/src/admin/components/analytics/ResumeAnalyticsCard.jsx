import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ResumeAnalyticsCard = ({ analytics }) => {
  if (!analytics) return null;

  const chartData = {
    labels: ["Excellent", "Good", "Average", "Poor"],
    datasets: [
      {
        label: "Resumes",
        data: [
          analytics.excellent || 0,
          analytics.good || 0,
          analytics.average || 0,
          analytics.poor || 0,
        ],
        backgroundColor: ["#10b981", "#6366f1", "#eab308", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Resume Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Total Uploads</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {analytics.totalUploads}
            </h3>
          </div>

          <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Average ATS Score</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {analytics.averageATS}%
            </h3>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Excellent</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {analytics.excellent}
            </h3>
          </div>

          <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Good</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">
              {analytics.good}
            </h3>
          </div>

          <div className="border border-yellow-100 bg-yellow-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Average</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              {analytics.average}
            </h3>
          </div>

          <div className="border border-red-100 bg-red-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Poor</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {analytics.poor}
            </h3>
          </div>
        </div>

        {/* Right Side: Bar Chart */}
        <div className="h-64 flex justify-center items-center relative lg:h-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Average ATS Score Progress bar */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 mt-8">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">
          Average ATS Progress
        </h3>
        <div className="w-full h-3 rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${analytics.averageATS}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-500 font-medium">
          Average ATS Score: <strong className="text-slate-900">{analytics.averageATS}%</strong>
        </p>
      </div>
    </div>
  );
};

export default ResumeAnalyticsCard;