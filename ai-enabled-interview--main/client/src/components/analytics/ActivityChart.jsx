import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { FaChartBar } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const ActivityChart = ({ analytics }) => {
  const data = {
    labels: [
      "Questions",
      "Coding",
      "Tests",
      "Contests",
      "Interviews",
    ],
    datasets: [
      {
        label: "Completed",
        data: [
          analytics?.questionsSolved || 0,
          analytics?.codingSolved || 0,
          analytics?.testsCompleted || 0,
          analytics?.contestsParticipated || 0,
          analytics?.interviewsCompleted || 0,
        ],
        backgroundColor: [
          "#3b82f6", // Blue
          "#10b981", // Emerald
          "#f59e0b", // Amber
          "#f43f5e", // Rose
          "#06b6d4", // Cyan
        ],
        borderRadius: 12,
        hoverBackgroundColor: [
          "#2563eb",
          "#059669",
          "#d97706",
          "#e11d48",
          "#0891b2",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(226, 232, 240, 0.6)",
        },
        ticks: {
          precision: 0,
          font: { size: 11, weight: "600" },
          color: "#64748b",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11, weight: "700" },
          color: "#334155",
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <h5 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FaChartBar className="text-indigo-600" />
          <span>Activity Overview</span>
        </h5>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          User Completion Analytics
        </span>
      </div>

      <div className="w-full h-80 sm:h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ActivityChart;
