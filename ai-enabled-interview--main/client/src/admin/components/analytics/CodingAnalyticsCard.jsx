import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { FaCode, FaLaptopCode, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBug } from "react-icons/fa";
ChartJS.register(ArcElement, Tooltip, Legend);

const CodingAnalyticsCard = ({ analytics }) => {
  if (!analytics) return null;

  const chartData = {
    labels: ["Accepted", "Wrong Answer", "Runtime Error", "Compile Error"],
    datasets: [
      {
        data: [
          analytics.accepted || 0,
          analytics.wrongAnswer || 0,
          analytics.runtimeError || 0,
          analytics.compileError || 0,
        ],
        backgroundColor: ["#10b981", "#ef4444", "#f97316", "#eab308"],
        borderColor: ["#059669", "#dc2626", "#ea580c", "#ca8a04"],
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
      <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm shadow-sm">
          <FaCode />
        </div>
        Coding Submissions & Performance
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4 my-3">
          <div className="border border-cyan-200/80 bg-gradient-to-br from-cyan-50/80 to-blue-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaCode className="text-cyan-500" /> Total Problems
            </p>
            <h3 className="text-3xl font-black text-cyan-700 mt-1">
              {analytics.totalProblems || 0}
            </h3>
          </div>

          <div className="border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaLaptopCode className="text-indigo-500" /> Submissions
            </p>
            <h3 className="text-3xl font-black text-indigo-700 mt-1">
              {analytics.totalSubmissions || 0}
            </h3>
          </div>

          <div className="border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> Accepted
            </p>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">
              {analytics.accepted || 0}
            </h3>
          </div>

          <div className="border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-red-50/40 rounded-2xl p-4 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaTimesCircle className="text-rose-500" /> Wrong Answer
            </p>
            <h3 className="text-3xl font-black text-rose-700 mt-1">
              {analytics.wrongAnswer || 0}
            </h3>
          </div>




        </div>

        {/* Right Side: Doughnut Chart */}
        <div className="h-64 flex justify-center items-center relative lg:h-full">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Acceptance Rate Progress Bar */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 mt-8">
        <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
          <span>Acceptance Rate</span>
          <span className="text-slate-900 font-bold">
            {analytics.acceptanceRate}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${analytics.acceptanceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodingAnalyticsCard;