import {
  FaEye,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

const InterviewTable = ({
  interviews = [],
  loading,
  onView,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-lg font-semibold">
          Loading interviews...
        </h2>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <FaUserTie className="mx-auto text-5xl text-gray-300 mb-4" />

        <h2 className="text-xl font-semibold">
          No Interviews Found
        </h2>

        <p className="text-gray-500 mt-2">
          There are no interview sessions available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        <table className="min-w-[800px] w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Candidate
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Experience
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Questions
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Created
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {interviews.map((interview) => (

              <tr
                key={interview._id}
                className="border-t hover:bg-gray-50 transition"
              >

                {/* Candidate */}

                <td className="px-6 py-4">

                  <h3 className="font-semibold">

                    {interview.user?.name}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {interview.user?.email}

                  </p>

                </td>

                {/* Role */}

                <td className="px-6 py-4">

                  {interview.role}

                </td>

                {/* Experience */}

                <td className="px-6 py-4">

                  {interview.experienceLevel}

                </td>

                {/* Questions */}

                <td className="px-6 py-4 text-center">

                  {interview.questions?.length || 0}

                </td>

                {/* Status */}

                <td className="px-6 py-4 text-center">

                  <StatusBadge
                    status={interview.status}
                  />

                </td>

                {/* Created */}

                <td className="px-6 py-4 text-center">

                  {new Date(
                    interview.createdAt
                  ).toLocaleDateString()}

                </td>

                {/* Actions */}

                <td className="px-6 py-4">

                  <div className="flex justify-center items-center gap-3">

                    <button
                      onClick={() =>
                        onView(interview)
                      }
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
                      title="View"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(interview)
                      }
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default InterviewTable;