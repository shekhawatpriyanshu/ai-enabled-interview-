import { useState } from "react";
import { Trophy, CheckCircle, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import useContest from "../../hooks/useContest";

const JoinContestCard = ({
  contest,
  isJoined,
  isLive,
  isUpcoming,
  isEnded,
  onJoinSuccess,
}) => {
  const { joinContestById } = useContest();
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    try {
      setJoining(true);
      await joinContestById(contest._id);
      if (onJoinSuccess) {
        onJoinSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to join contest.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 rounded-3xl border border-indigo-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden text-slate-800"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600" />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
          <Trophy size={22} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Contest Participation
        </h2>
      </div>

      <p className="text-slate-600 text-xs font-semibold leading-relaxed">
        Join this contest to compete live with other developers, solve challenges, build speed, and submit your code before the timer expires.
      </p>

      <div className="mt-6">
        {isJoined ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider shadow-2xs">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>Successfully Joined Contest</span>
            </div>
            {isLive && (
              <button
                onClick={() => {
                  const el = document.getElementById("contest-problems-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Go to Problems Section
              </button>
            )}
          </div>
        ) : isUpcoming ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-3.5 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-wider cursor-not-allowed"
          >
            Contest Not Started Yet
          </button>
        ) : isEnded ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-3.5 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-wider cursor-not-allowed"
          >
            Contest Has Ended
          </button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={joining}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Play size={16} />
            <span>{joining ? "Joining Contest..." : "Join Contest Now"}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default JoinContestCard;