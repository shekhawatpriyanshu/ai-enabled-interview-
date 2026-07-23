import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaEdit,
  FaUsers,
  FaTrophy,
  FaClock,
  FaCode,
} from "react-icons/fa";

import useContest from "../../hooks/useContest";

const ContestDetails = () => {
  const { id } = useParams();

  const {
    contest,
    loading,
    loadContest,
  } = useContest();

  useEffect(() => {
    loadContest(id);
  }, [id]);

  if (loading || !contest) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          Loading contest...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center">

        <div>

          <h1 className="text-3xl font-bold">
            {contest.title}
          </h1>

          <p className="text-gray-500 mt-2">
            Contest Details
          </p>

        </div>

        <div className="flex gap-3 mt-4 md:mt-0">

          <Link
            to={`/admin/contests/edit/${contest._id}`}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaEdit />

            Edit
          </Link>

          <Link
            to={`/admin/contests/${contest._id}/participants`}
            className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <FaUsers />

            Participants
          </Link>

          <Link
            to={`/admin/contests/${contest._id}/leaderboard`}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <FaTrophy />

            Leaderboard
          </Link>

        </div>

      </div>

      {/* Contest Info */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Contest Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <p className="text-gray-500">
              Status
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium
              ${
                contest.status === "Live"
                  ? "bg-green-100 text-green-700"
                  : contest.status === "Upcoming"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {contest.status}
            </span>

          </div>

          <div>

            <p className="text-gray-500">
              Duration
            </p>

            <div className="mt-2 flex items-center gap-2">

              <FaClock />

              {contest.duration} Minutes

            </div>

          </div>

          <div>

            <p className="text-gray-500">
              Start Time
            </p>

            <p className="mt-2">
              {new Date(
                contest.startTime
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <p className="text-gray-500">
              End Time
            </p>

            <p className="mt-2">
              {new Date(
                contest.endTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Description
        </h2>

        <p className="leading-7 text-gray-700 whitespace-pre-line">
          {contest.description}
        </p>

      </div>

      {/* Problems */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">

          <FaCode />

          Coding Problems ({contest.problems?.length || 0})

        </h2>

        {contest.problems?.length === 0 ? (
          <p className="text-gray-500">
            No problems added.
          </p>
        ) : (
          <div className="space-y-4">

            {contest.problems.map((problem, index) => (
              <div
                key={problem._id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold">
                      {index + 1}. {problem.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {problem.topic}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default ContestDetails;