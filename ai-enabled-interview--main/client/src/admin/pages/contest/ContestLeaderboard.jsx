import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrophy,
  FaMedal,
} from "react-icons/fa";

import useContest from "../../hooks/useContest";

const ContestLeaderboard = () => {
  const { id } = useParams();

  const {
    leaderboard,
    loading,
    loadLeaderboard,
  } = useContest();

  useEffect(() => {
    loadLeaderboard(id);
  }, [id]);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Contest Leaderboard
          </h1>

          <p className="text-gray-500 mt-1">
            Contest rankings based on score.
          </p>

        </div>

        <Link
          to={`/admin/contests/${id}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* Leaderboard */}

      <div className="overflow-x-auto rounded-lg bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-5 py-4 text-left">
                Rank
              </th>

              <th className="px-5 py-4 text-left">
                Name
              </th>

              <th className="px-5 py-4 text-left">
                Email
              </th>

              <th className="px-5 py-4 text-center">
                Score
              </th>

              <th className="px-5 py-4 text-center">
                Submitted
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center"
                >
                  Loading leaderboard...
                </td>
              </tr>
            )}

            {!loading &&
              leaderboard.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
                  >
                    No leaderboard data found.
                  </td>
                </tr>
              )}

            {!loading &&
              leaderboard.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      {index === 0 && (
                        <FaMedal className="text-yellow-500" />
                      )}

                      {index === 1 && (
                        <FaMedal className="text-gray-500" />
                      )}

                      {index === 2 && (
                        <FaMedal className="text-orange-500" />
                      )}

                      #{item.rank}

                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {item.user?.name}
                  </td>

                  <td className="px-5 py-4">
                    {item.user?.email}
                  </td>

                  <td className="px-5 py-4 text-center font-semibold">
                    {item.score}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </td>

                </tr>
              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ContestLeaderboard;