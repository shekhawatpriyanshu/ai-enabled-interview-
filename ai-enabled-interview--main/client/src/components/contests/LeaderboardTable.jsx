import {
  Trophy,
  Medal,
  Award,
} from "lucide-react";

const LeaderboardTable = ({
  leaderboard = [],
}) => {
  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-10 text-center">

        <Trophy
          size={55}
          className="mx-auto text-gray-400"
        />

        <h2 className="text-2xl font-bold mt-4">
          No Leaderboard Yet
        </h2>

        <p className="text-gray-500 mt-2">
          Once participants submit the contest,
          rankings will appear here.
        </p>

      </div>
    );
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Trophy
            className="text-yellow-500"
            size={22}
          />
        );

      case 2:
        return (
          <Medal
            className="text-gray-500"
            size={22}
          />
        );

      case 3:
        return (
          <Award
            className="text-orange-500"
            size={22}
          />
        );

      default:
        return (
          <span className="font-semibold">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">
          Leaderboard
        </h2>

      </div>

      {/* Desktop */}

      <div className="hidden md:block overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">
                Rank
              </th>

              <th className="text-left px-6 py-4">
                Participant
              </th>

              <th className="text-left px-6 py-4">
                Email
              </th>

              <th className="text-center px-6 py-4">
                Score
              </th>

            </tr>

          </thead>

          <tbody>

            {leaderboard.map((item, index) => {

              const rank =
                item.rank || index + 1;

              return (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-5">
                    {getRankBadge(rank)}
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    {item.user?.name}
                  </td>

                  <td className="px-6 py-5 text-gray-500">
                    {item.user?.email}
                  </td>

                  <td className="px-6 py-5 text-center font-bold text-blue-600">
                    {item.score}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* Mobile */}

      <div className="md:hidden">

        {leaderboard.map((item, index) => {

          const rank =
            item.rank || index + 1;

          return (
            <div
              key={item._id}
              className="border-t p-5"
            >

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  {getRankBadge(rank)}

                  <div>

                    <h3 className="font-semibold">
                      {item.user?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.user?.email}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    Score
                  </p>

                  <p className="font-bold text-blue-600">
                    {item.score}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default LeaderboardTable;