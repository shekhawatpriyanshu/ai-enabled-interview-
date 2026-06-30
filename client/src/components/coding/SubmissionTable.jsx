import { format } from "date-fns";

const SubmissionTable = ({
  submissions,
}) => {
  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Wrong Answer":
        return "bg-red-100 text-red-700";

      case "Runtime Error":
        return "bg-orange-100 text-orange-700";

      case "Compilation Error":
        return "bg-yellow-100 text-yellow-700";

      case "Time Limit Exceeded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyStyle = (
    difficulty
  ) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600";

      case "Medium":
        return "text-yellow-600";

      case "Hard":
        return "text-red-600";

      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="px-6 py-4 text-left">
                Problem
              </th>

              <th className="px-6 py-4 text-left">
                Difficulty
              </th>

              <th className="px-6 py-4 text-left">
                Language
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Score
              </th>

              <th className="px-6 py-4 text-left">
                Submitted On
              </th>

            </tr>

          </thead>

          <tbody>

            {submissions.map(
              (submission) => (

                <tr
                  key={submission._id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {submission.problem?.title ||
                      "N/A"}
                  </td>

                  <td
                    className={`px-6 py-4 font-semibold ${getDifficultyStyle(
                      submission.problem
                        ?.difficulty
                    )}`}
                  >
                    {submission.problem
                      ?.difficulty || "-"}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {submission.language}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {submission.score}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {format(
                      new Date(
                        submission.createdAt
                      ),
                      "dd MMM yyyy, hh:mm a"
                    )}
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

export default SubmissionTable;