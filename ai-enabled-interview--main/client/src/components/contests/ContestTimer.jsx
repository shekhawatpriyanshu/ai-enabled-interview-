import { useEffect, useState } from "react";
import { Clock3, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

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

      if (contest.status === "Live" || (now >= start && now < end)) {
        setLabel("Time Remaining");
        difference = end - now;
        if (difference < 0) {
          setLabel("Contest Ended");
          setTimeLeft("00:00:00");
          return;
        }
      } else if (contest.status === "Completed" || now >= end) {
        setLabel("Contest Ended");
        setTimeLeft("00:00:00");
        return;
      } else {
        setLabel("Starts In");
        difference = start - now;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const style =
    label === "Time Remaining"
      ? {
          bg: "bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 text-white shadow-emerald-500/25",
          badge: "bg-white/20 text-white border-white/30",
          topLine: "from-emerald-300 to-cyan-300",
        }
      : label === "Starts In"
      ? {
          bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-amber-500/25",
          badge: "bg-white/20 text-white border-white/30",
          topLine: "from-yellow-300 to-amber-300",
        }
      : {
          bg: "bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 text-white shadow-slate-900/25",
          badge: "bg-white/10 text-slate-300 border-white/15",
          topLine: "from-slate-400 to-purple-400",
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-3xl border p-6 sm:p-8 flex items-center justify-between shadow-xl relative overflow-hidden text-white ${style.bg}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 via-white to-white/40" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl shadow-md">
          <Hourglass className="animate-spin text-white" size={28} />
        </div>

        <div>
          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border mb-1.5 ${style.badge}`}>
            {label}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            {timeLeft}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestTimer;