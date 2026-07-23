import {
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaCode,
  FaCalendarAlt,
} from "react-icons/fa";

const ParticipantsTable = ({
  participants = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <p className="text-gray-500">
          Loading participants...
        </p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <p className="text-gray-500">
          No participants found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-5 py-4 text-center">
              #
            </th>

            <th className="px-5 py-4 text-left">
              User
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
              Joined At
            </th>

          </tr>

        </thead>

        <tbody>

          {participants.map(
            (participant, index) => (
              <tr
                key={participant._id}
                className="border-t hover:bg-gray-50"
              >
                {/* Serial */}

                <td className="px-5 py-4 text-center font-medium">
                  {index + 1}
                </td>

                {/* User */}

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">

                      <FaUser className="text-blue-600" />

                    </div>

                    <div>

                      <p className="font-semibold">
                        {participant.user?.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID :
                        {" "}
                        {participant.user?._id}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Email */}

                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    <FaEnvelope className="text-gray-400" />

                    {participant.user?.email}

                  </div>

                </td>

                {/* Score */}

                <td className="px-5 py-4 text-center">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {participant.score}
                  </span>

                </td>

                {/* Solved */}

                <td className="px-5 py-4 text-center">

                  <div className="flex justify-center items-center gap-2">

                    <FaCheckCircle className="text-green-600" />

                    {participant.solvedProblems}

                  </div>

                </td>

                {/* Total */}

                <td className="px-5 py-4 text-center">

                  <div className="flex justify-center items-center gap-2">

                    <FaCode className="text-blue-600" />

                    {participant.totalProblems}

                  </div>

                </td>

                {/* Joined */}

                <td className="px-5 py-4 text-center">

                  <div className="flex justify-center items-center gap-2">

                    <FaCalendarAlt className="text-gray-500" />

                    {new Date(
                      participant.createdAt
                    ).toLocaleString()}

                  </div>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>
    </div>
  );
};

export default ParticipantsTable;