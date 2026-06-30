import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useContest from "../../hooks/useContest";

import {
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const JoinContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    contest,
    loadContest,
    joinContestById,
    loading,
  } = useContest();

  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (id) {
      loadContest(id);
    }
  }, [id, loadContest]);

  const handleJoin = async () => {
    try {
      setJoining(true);

      await joinContestById(id);

      setJoined(true);

      setTimeout(() => {
        navigate(`/contests/${id}`);
      }, 1000);

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to join contest"
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading || !contest) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading contest details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Header */}
      <div className="bg-white border rounded-xl p-8 shadow-sm">

        <div className="flex items-center gap-3">

          <Trophy className="text-yellow-500" />

          <h1 className="text-2xl font-bold">
            Join Contest
          </h1>

        </div>

        <h2 className="mt-4 text-xl font-semibold">
          {contest.title}
        </h2>

        <p className="text-gray-500 mt-2">
          {contest.description}
        </p>

      </div>

      {/* Contest Info */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">

        <div className="bg-blue-50 p-5 rounded-xl">
          <Clock className="text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">
            Duration
          </p>
          <p className="font-bold">
            {contest.duration} Minutes
          </p>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl">
          <AlertTriangle className="text-yellow-600" />
          <p className="mt-2 text-sm text-gray-600">
            Problems
          </p>
          <p className="font-bold">
            {contest.problems?.length || 0}
          </p>
        </div>

        <div className="bg-green-50 p-5 rounded-xl">
          <CheckCircle className="text-green-600" />
          <p className="mt-2 text-sm text-gray-600">
            Status
          </p>
          <p className="font-bold">
            {contest.status}
          </p>
        </div>

      </div>

      {/* Instructions */}
      <div className="bg-white border rounded-xl p-6 mt-6">

        <h3 className="text-lg font-bold mb-3">
          Instructions
        </h3>

        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Do not refresh the page during contest</li>
          <li>Make sure you submit before time ends</li>
          <li>You can solve problems in any order</li>
          <li>Leaderboard updates after submission</li>
        </ul>

      </div>

      {/* Join Button */}
      <div className="mt-8 flex justify-center">

        {joined ? (
          <div className="text-green-600 font-semibold flex items-center gap-2">
            <CheckCircle />
            Joined Successfully! Redirecting...
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg disabled:bg-gray-400"
          >
            {joining ? "Joining..." : "Join Contest"}
          </button>
        )}

      </div>

    </div>
  );
};

export default JoinContest;