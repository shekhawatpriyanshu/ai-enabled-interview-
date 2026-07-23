import { FaMedal } from "react-icons/fa";

const LeaderboardTable = ({
  leaderboard = [],
  loading = false,
}) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <FaMedal className="text-yellow-500" />
        );

      case 2:
        return (
          <FaMedal className="text-gray-400" />
        );

      case 3:
        return (
          <FaMedal className="text-orange-500" />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <p className="text-gray-500">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <p className="text-gray-500">
          No leaderboard available.
        </p>
      </div>
    );
  }

  return (
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
              Submitted At
            </th>

          </tr>

        </thead>

        <tbody>

          {leaderboard.map(
            (item, index) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    {getRankIcon(
                      index + 1
                    )}

                    <span className="font-semibold">
                      #{index + 1}
                    </span>

                  </div>

                </td>

                <td className="px-5 py-4 font-medium">
                  {item.user?.name}
                </td>

                <td className="px-5 py-4">
                  {item.user?.email}
                </td>

                <td className="px-5 py-4 text-center">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {item.score}
                  </span>

                </td>

                <td className="px-5 py-4 text-center">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
};

export default LeaderboardTable;