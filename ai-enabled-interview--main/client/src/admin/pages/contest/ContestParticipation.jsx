import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
} from "react-icons/fa";

import ContestService from "../../services/ContestService";

const ContestParticipants = () => {
  const { id } = useParams();

  const [participants, setParticipants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const res =
        await ContestService.getParticipants(
          id
        );

      setParticipants(
        res.participants || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUsers />
            Contest Participants
          </h1>

          <p className="text-gray-500 mt-1">
            All users who joined this contest.
          </p>

        </div>

        <Link
          to={`/admin/contests/${id}`}
          className="border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-lg bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-5 py-4 text-left">
                #
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
                Solved
              </th>

              <th className="px-5 py-4 text-center">
                Total
              </th>

              <th className="px-5 py-4 text-center">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10"
                >
                  Loading participants...
                </td>
              </tr>
            )}

            {!loading &&
              participants.length ===
                0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No participants found.
                  </td>
                </tr>
              )}

            {!loading &&
              participants.map(
                (
                  participant,
                  index
                ) => (
                  <tr
                    key={
                      participant._id
                    }
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {
                        participant
                          .user?.name
                      }
                    </td>

                    <td className="px-5 py-4">
                      {
                        participant
                          .user?.email
                      }
                    </td>

                    <td className="px-5 py-4 text-center">
                      {
                        participant.score
                      }
                    </td>

                    <td className="px-5 py-4 text-center">
                      {
                        participant.solvedProblems
                      }
                    </td>

                    <td className="px-5 py-4 text-center">
                      {
                        participant.totalProblems
                      }
                    </td>

                    <td className="px-5 py-4 text-center">
                      {new Date(
                        participant.createdAt
                      ).toLocaleString()}
                    </td>

                  </tr>
                )
              )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ContestParticipants;