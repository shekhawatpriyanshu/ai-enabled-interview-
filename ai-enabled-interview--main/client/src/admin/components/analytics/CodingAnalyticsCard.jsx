import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

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
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Coding Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Total Problems</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {analytics.totalProblems}
            </h3>
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Total Submissions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {analytics.totalSubmissions}
            </h3>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Accepted</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {analytics.accepted}
            </h3>
          </div>

          <div className="border border-red-100 bg-red-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Wrong Answer</p>
            <h3 className="text-2xl font-bold text-red-500 mt-1">
              {analytics.wrongAnswer}
            </h3>
          </div>

          <div className="border border-orange-100 bg-orange-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Runtime Error</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-1">
              {analytics.runtimeError}
            </h3>
          </div>

          <div className="border border-yellow-100 bg-yellow-50/30 rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium">Compilation Error</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              {analytics.compileError}
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