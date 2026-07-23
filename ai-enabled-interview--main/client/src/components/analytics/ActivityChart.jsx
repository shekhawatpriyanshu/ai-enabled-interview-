// src/components/analytics/ActivityChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

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
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#0dcaf0",
        ],
        borderRadius: 10,
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
        enabled: true,
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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">

        <h5 className="fw-bold mb-4">
          Activity Overview
        </h5>

        <div style={{ height: "400px" }}>
          <Bar
            data={data}
            options={options}
          />
        </div>

      </div>
    </div>
  );
};

export default ActivityChart;
