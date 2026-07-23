import { useEffect } from "react";
import { Link } from "react-router-dom";

import useAchievement from "../../../admin/hooks/useAchievement";

import DashboardCards from "../../../admin/components/achievement/DashboardCards";

const AchievementDashboard = () => {
  const {
    loading,
    dashboard,
    getDashboard,
  } = useAchievement();

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Achievement Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage achievements, badges and
            user rewards.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={getDashboard}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
          >
            Refresh
          </button>

          <Link
            to="/admin/achievement/add"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Achievement
          </Link>
        </div>
      </div>

      {/* Cards */}

      <DashboardCards
        dashboard={dashboard}
      />

      {/* Recent Achievements */}

      <div className="bg-white rounded-xl shadow mt-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            Recent Achievements
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            Loading...
          </div>
        ) : dashboard?.recentAchievements
            ?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3">
                    Title
                  </th>

                  <th className="text-left px-6 py-3">
                    Category
                  </th>

                  <th className="text-left px-6 py-3">
                    Target
                  </th>

                  <th className="text-left px-6 py-3">
                    Badge
                  </th>

                  <th className="text-left px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentAchievements.map(
                  (
                    achievement
                  ) => (
                    <tr
                      key={
                        achievement._id
                      }
                      className="border-t"
                    >
                      <td className="px-6 py-4 font-medium">
                        {
                          achievement.title
                        }
                      </td>

                      <td className="px-6 py-4 capitalize">
                        {
                          achievement.category
                        }
                      </td>

                      <td className="px-6 py-4">
                        {
                          achievement.target
                        }
                      </td>

                      <td className="px-6 py-4">
                        {achievement
                          .badge
                          ?.title ||
                          "-"}
                      </td>

                      <td className="px-6 py-4">
                        {achievement.isActive ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No achievements found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementDashboard;