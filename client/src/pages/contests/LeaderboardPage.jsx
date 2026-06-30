import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import useContest from "../../hooks/useContest";

import ContestHeader from "../../components/contests/ContestHeader";
import LeaderboardTable from "../../components/contests/LeaderboardTable";

import { Trophy } from "lucide-react";

const Leaderboard = () => {
  const { id } = useParams();

  const {
    contest,
    leaderboard,
    loadContest,
    loadLeaderboard,
    loading,
  } = useContest();

  useEffect(() => {
    if (id) {
      loadContest(id);
      loadLeaderboard(id);
    }
  }, [id, loadContest, loadLeaderboard]);

  const refreshLeaderboard = () => {
    loadLeaderboard(id);
  };

  if (loading && !contest) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="p-10 text-center text-red-500">
        Contest not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Contest Header */}
      <ContestHeader contest={contest} />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <h1 className="text-2xl font-bold">
            Contest Leaderboard
          </h1>
        </div>

        <div className="flex gap-3">

          <button
            onClick={refreshLeaderboard}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            Refresh
          </button>

          <Link
            to={`/contests/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Back to Contest
          </Link>

        </div>

      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Total Participants
          </p>
          <p className="text-xl font-bold">
            {leaderboard.length}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Highest Score
          </p>
          <p className="text-xl font-bold text-green-600">
            {leaderboard.length > 0
              ? Math.max(
                  ...leaderboard.map((l) => l.score)
                )
              : 0}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Average Score
          </p>
          <p className="text-xl font-bold text-blue-600">
            {leaderboard.length > 0
              ? (
                  leaderboard.reduce(
                    (acc, cur) => acc + cur.score,
                    0
                  ) / leaderboard.length
                ).toFixed(2)
              : 0}
          </p>
        </div>

      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable leaderboard={leaderboard} />

    </div>
  );
};

export default Leaderboard;