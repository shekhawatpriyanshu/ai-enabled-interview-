import { useEffect, useRef } from "react";
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
  const problemsSectionRef = useRef(null);

  const {
    contest,
    leaderboard,
    loadContest,
    loadLeaderboard,
    loading,
    myContests,
    loadMyContests,
  } = useContest();

  useEffect(() => {
    if (id) {
      loadContest(id);
      loadLeaderboard(id);
      loadMyContests();
    }
  }, [id, loadContest, loadLeaderboard, loadMyContests]);

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

  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  
  const isLive = contest.status === "Live" || (now >= start && now < end);
  const isUpcoming = contest.status !== "Live" && (contest.status === "Upcoming" || now < start);
  const isEnded = contest.status !== "Live" && (contest.status === "Completed" || now > end);

  const isJoined = myContests.some(
    (item) => (item.contest?._id || item.contest) === contest._id
  );

  const handleJoinSuccess = async () => {
    await loadMyContests();
    setTimeout(() => {
      const el = document.getElementById("contest-problems-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Contest Header */}
      <ContestHeader contest={contest} />

      {/* Live / Countdown Timer */}
      <ContestTimer contest={contest} />

      {/* Stats */}
      <ContestStats contest={contest} />

      {/* Join Contest Section */}
      <JoinContestCard
        contest={contest}
        isJoined={isJoined}
        isLive={isLive}
        isUpcoming={isUpcoming}
        isEnded={isEnded}
        onJoinSuccess={handleJoinSuccess}
      />

      {/* Problems Section */}
      <div id="contest-problems-section" ref={problemsSectionRef}>
        {isJoined && isLive ? (
          <ProblemList problems={contest.problems} />
        ) : (
          <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-500">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Coding Problems</h3>
            <p className="text-sm">
              {isUpcoming
                ? "This contest has not started yet. Problems will be available once the contest is live and you have joined."
                : isEnded
                ? "This contest has ended."
                : "You must join this live contest to view and solve the coding problems."}
            </p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <LeaderboardTable leaderboard={leaderboard} />

    </div>
  );
};

export default ContestDetails;