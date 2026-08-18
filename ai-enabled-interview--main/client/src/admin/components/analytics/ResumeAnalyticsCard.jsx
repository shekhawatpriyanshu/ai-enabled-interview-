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

import { FaFileAlt, FaChartLine, FaStar, FaThumbsUp, FaMinusCircle, FaExclamationCircle } from "react-icons/fa";
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
      <h2 className="text-2xl font-black bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm shadow-sm">
          <FaFileAlt />
        </div>
        Resume Uploads & ATS Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4 my-3">
          <div className="border border-orange-200/80 bg-gradient-to-br from-orange-50/80 to-amber-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaFileAlt className="text-orange-500" /> Total Uploads
            </p>
            <h3 className="text-3xl font-black text-orange-700 mt-1">
              {analytics.totalUploads || 0}
            </h3>
          </div>

          <div className="border border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-cyan-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaChartLine className="text-blue-500" /> Average ATS
            </p>
            <h3 className="text-3xl font-black text-blue-700 mt-1">
              {analytics.averageATS || 0}%
            </h3>
          </div>

          <div className="border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaStar className="text-emerald-500" /> Excellent
            </p>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">
              {analytics.excellent || 0}
            </h3>
          </div>

          <div className="border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaThumbsUp className="text-indigo-500" /> Good
            </p>
            <h3 className="text-3xl font-black text-indigo-700 mt-1">
              {analytics.good || 0}
            </h3>
          </div>

          <div className="border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-yellow-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaMinusCircle className="text-amber-500" /> Average
            </p>
            <h3 className="text-3xl font-black text-amber-700 mt-1">
              {analytics.average || 0}
            </h3>
          </div>

          <div className="border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-red-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaExclamationCircle className="text-rose-500" /> Poor
            </p>
            <h3 className="text-3xl font-black text-rose-700 mt-1">
              {analytics.poor || 0}
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