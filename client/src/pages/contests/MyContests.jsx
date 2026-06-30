import { useEffect } from "react";
import { Link } from "react-router-dom";

import useContest from "../../hooks/useContest";

const MyContests = () => {
  const {
    myContests,
    loading,
    loadMyContests,
  } = useContest();

  useEffect(() => {
    loadMyContests();
  }, [loadMyContests]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your contests...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Contests
        </h1>

        <p className="text-gray-500 mt-2">
          Track your contest history, scores, and rankings
        </p>
      </div>

      {/* Empty State */}
      {myContests.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          You have not joined any contests yet.
          <div className="mt-4">
            <Link
              to="/contests"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Browse Contests
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">

          {myContests.map((item) => {

            const contest = item.contest;

            return (
              <div
                key={item._id}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-xl font-bold">
                      {contest.title}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {contest.description}
                    </p>
                  </div>

                  <Link
                    to={`/contests/${contest._id}`}
                    className="mt-4 md:mt-0 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
                  >
                    View Contest
                  </Link>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Score
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {item.score}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Solved
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {item.solvedProblems}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Total Problems
                    </p>
                    <p className="text-xl font-bold text-yellow-600">
                      {item.totalProblems}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Rank
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      #{item.rank || "N/A"}
                    </p>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default MyContests;