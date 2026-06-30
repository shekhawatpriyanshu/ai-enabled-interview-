import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const ContestTimer = ({ contest }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!contest) return;

    const updateTimer = () => {
      const now = new Date();

      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      let difference = 0;

      if (now < start) {
        setLabel("Starts In");
        difference = start - now;
      } else if (now >= start && now < end) {
        setLabel("Time Remaining");
        difference = end - now;
      } else {
        setLabel("Contest Ended");
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(
        difference / (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000
      );

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => clearInterval(interval);
  }, [contest]);

  const color =
    label === "Starts In"
      ? "text-yellow-600"
      : label === "Time Remaining"
      ? "text-green-600"
      : "text-gray-600";

  const bg =
    label === "Starts In"
      ? "bg-yellow-50"
      : label === "Time Remaining"
      ? "bg-green-50"
      : "bg-gray-100";

  return (
    <div
      className={`rounded-xl border shadow-sm p-6 flex items-center justify-between ${bg}`}
    >
      <div className="flex items-center gap-4">
        <Clock3
          size={34}
          className={color}
        />

        <div>
          <p className="text-gray-500 text-sm">
            {label}
          </p>

          <h2
            className={`text-3xl font-bold ${color}`}
          >
            {timeLeft}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ContestTimer;