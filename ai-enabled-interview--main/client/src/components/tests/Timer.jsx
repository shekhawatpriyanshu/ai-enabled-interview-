import { useEffect } from "react";
import {
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const Timer = ({
  timeLeft,
  onTimeUp,
}) => {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = 60 * 60; // Change if needed

  const percentage =
    (timeLeft / totalSeconds) * 100;

  const warning = timeLeft <= 300;
  const danger = timeLeft <= 60;

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 border transition-all

      ${
        danger
          ? "bg-red-50 border-red-400"
          : warning
          ? "bg-yellow-50 border-yellow-400"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Remaining Time
          </h2>

          <p className="text-gray-500">
            Test countdown
          </p>

        </div>

        <FaClock
          className={`text-4xl

          ${
            danger
              ? "text-red-600 animate-pulse"
              : warning
              ? "text-yellow-500"
              : "text-cyan-600"
          }
          `}
        />

      </div>

      <div className="mt-8 text-center">

        <h1
          className={`text-5xl font-bold tracking-wider

          ${
            danger
              ? "text-red-600 animate-pulse"
              : warning
              ? "text-yellow-600"
              : "text-cyan-700"
          }
          `}
        >
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </h1>

      </div>

      <div className="mt-8">

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className={`h-4 rounded-full transition-all duration-1000

            ${
              danger
                ? "bg-red-600"
                : warning
                ? "bg-yellow-500"
                : "bg-cyan-600"
            }
            `}
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {warning && (

        <div className="mt-6 flex items-center gap-3 text-yellow-700">

          <FaExclamationTriangle />

          <span className="font-semibold">

            Less than 5 minutes remaining!

          </span>

        </div>

      )}

      {danger && (

        <div className="mt-4 text-red-600 font-bold text-center animate-pulse">

          Test will auto submit soon!

        </div>

      )}

    </div>
  );
};

export default Timer;