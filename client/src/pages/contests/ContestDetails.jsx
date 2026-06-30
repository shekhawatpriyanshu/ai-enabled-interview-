import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useContest from "../../hooks/useContest";

import ContestHeader from "../../components/contests/ContestHeader";
import ContestStats from "../../components/contests/ContestStats";
import ContestTimer from "../../components/contests/ContestTimer";
import JoinContestCard from "../../components/contests/JoinContestCard";
import ProblemList from "../../components/contests/ProblemList";
import LeaderboardTable from "../../components/contests/LeaderboardTable";

const ContestDetails = () => {
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

  if (loading && !contest) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading contest details...
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Contest Header */}
      <ContestHeader contest={contest} />

      {/* Live / Countdown Timer */}
      <ContestTimer contest={contest} />

      {/* Stats */}
      <ContestStats contest={contest} />

      {/* Join Contest Section */}
      <JoinContestCard contest={contest} />

      {/* Problems */}
      <ProblemList problems={contest.problems} />

      {/* Leaderboard */}
      <LeaderboardTable leaderboard={leaderboard} />

    </div>
  );
};

export default ContestDetails;