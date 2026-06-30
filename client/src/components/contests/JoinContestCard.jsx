import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle,
  Play,
} from "lucide-react";

import useContest from "../../hooks/useContest";

const JoinContestCard = ({ contest }) => {
  const navigate = useNavigate();

  const { joinContestById } =
    useContest();

  const [joining, setJoining] =
    useState(false);

  const [joined, setJoined] =
    useState(false);

  const handleJoin = async () => {
    try {
      setJoining(true);

      await joinContestById(
        contest._id
      );

      setJoined(true);

      navigate(
        `/contests/join/${contest._id}`
      );
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

        {joined ? (
          <div className="flex items-center gap-2 text-green-600 font-semibold">

            <CheckCircle size={22} />

            Successfully Joined

          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition"
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