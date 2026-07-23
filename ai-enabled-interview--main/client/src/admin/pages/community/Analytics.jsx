import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";
import AnalyticsCards from "../../components/community/AnalyticsCards";

const Analytics = () => {
  const {
    loading,
    getAnalytics,
  } = useAdminCommunity();

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res =
      await getAnalytics();

    if (res?.success) {
      setAnalytics(res.analytics);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">

        <FaChartLine className="text-4xl text-blue-600" />

        <div>

          <h1 className="text-3xl font-bold">
            Community Analytics
          </h1>

          <p className="text-gray-500">
            Community insights and activity.
          </p>

        </div>

      </div>

      {/* Statistics */}

      <AnalyticsCards
        analytics={analytics}
      />

      {/* Top Groups */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-5">
          Top Study Groups
        </h2>

        {analytics.topGroups?.length ? (

          <div className="space-y-4">

            {analytics.topGroups.map(
              (group, index) => (

                <div
                  key={group._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {index + 1}. {group.name}
                    </h3>

                    <p className="text-gray-500">
                      {group.description}
                    </p>

                  </div>

                  <span className="font-bold">
                    {group.membersCount} Members
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <p>No groups found.</p>

        )}

      </div>

      {/* Top Discussions */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-5">
          Top Discussions
        </h2>

        {analytics.topDiscussions?.length ? (

          <div className="space-y-4">

            {analytics.topDiscussions.map(
              (discussion, index) => (

                <div
                  key={discussion._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {index + 1}. {discussion.title}
                    </h3>

                    <p className="text-gray-500">
                      {discussion.user?.name}
                    </p>

                  </div>

                  <span className="font-bold">
                    ❤️ {discussion.totalLikes}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <p>No discussions found.</p>

        )}

      </div>

      {/* Active Users */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-5">
          Most Active Users
        </h2>

        {analytics.activeUsers?.length ? (

          <div className="space-y-4">

            {analytics.activeUsers.map(
              (user, index) => (

                <div
                  key={user._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {index + 1}. {user.name}
                    </h3>

                    <p className="text-gray-500">
                      {user.email}
                    </p>

                  </div>

                  <span className="font-bold">
                    {user.messageCount} Messages
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <p>No active users found.</p>

        )}

      </div>

    </div>
  );
};

export default Analytics;