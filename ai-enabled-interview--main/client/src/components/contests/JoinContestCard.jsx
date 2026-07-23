import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle,
  Play,
} from "lucide-react";

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
      alert(
        error.response?.data?.message ||
          "Unable to join contest."
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">

      <div className="flex items-center gap-3">

        <Trophy
          className="text-yellow-500"
          size={28}
        />

        <h2 className="text-xl font-bold">
          Contest Participation
        </h2>

      </div>

      <p className="text-gray-500 mt-4 leading-7">
        Join this contest to compete with other
        participants and submit your solutions before
        the contest ends.
      </p>

      <div className="mt-8">

        {isJoined ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle size={22} />
              Successfully Joined
            </div>
            {isLive && (
              <button
                onClick={() => {
                  const el = document.getElementById("contest-problems-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Go to Problems
              </button>
            )}
          </div>
        ) : isUpcoming ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 py-3 rounded-lg border cursor-not-allowed"
          >
            Contest Not Started
          </button>
        ) : isEnded ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 py-3 rounded-lg border cursor-not-allowed"
          >
            Contest Ended
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-medium"
          >
            <Play size={18} />

            {joining
              ? "Joining..."
              : "Join Contest"}
          </button>
        )}

      </div>

    </div>
  );
};

export default JoinContestCard;