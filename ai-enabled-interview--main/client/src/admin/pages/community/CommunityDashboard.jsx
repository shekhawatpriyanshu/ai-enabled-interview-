import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaComments,
  FaUsers,
  FaLayerGroup,
  FaCommentDots,
  FaArrowRight,
} from "react-icons/fa";

import CommunityStats from "../../components/community/CommunityStats";
import AnalyticsCards from "../../components/community/AnalyticsCards";
import useAdminCommunity from "../../hooks/useAdminCommunity";

const CommunityDashboard = () => {
  const { loading, getDashboard } = useAdminCommunity();

  const [stats, setStats] = useState({
    totalDiscussions: 0,
    totalComments: 0,
    totalGroups: 0,
    totalMessages: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await getDashboard();

    if (res?.success) {
      setStats(res.stats);
    }
  };

  const quickActions = [
    {
      title: "Manage Discussions",
      icon: <FaComments />,
      color: "bg-blue-500",
      link: "/admin/community/discussions",
    },
    {
      title: "Manage Comments",
      icon: <FaCommentDots />,
      color: "bg-green-500",
      link: "/admin/community/comments",
    },
    {
      title: "Manage Groups",
      icon: <FaLayerGroup />,
      color: "bg-purple-500",
      link: "/admin/community/groups",
    },
    {
      title: "Manage Messages",
      icon: <FaUsers />,
      color: "bg-orange-500",
      link: "/admin/community/messages",
    },
  ];

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Community Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage discussions, study groups, comments and messages.
          </p>
        </div>
      </div>

      {/* Stats */}

      <CommunityStats
        loading={loading}
        stats={stats}
      />

      {/* Analytics */}

      <div className="mt-10">
        <AnalyticsCards stats={stats} />
      </div>

      {/* Quick Actions */}

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {quickActions.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 border"
            >
              <div className="p-6">

                <div
                  className={`w-14 h-14 rounded-full text-white flex items-center justify-center text-xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  {item.title}
                </h3>

                <div className="flex items-center text-blue-600 mt-5">
                  Open
                  <FaArrowRight className="ml-2" />
                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>

      {/* Summary */}

      <div className="mt-10 bg-white rounded-xl shadow border p-6">

        <h2 className="text-lg font-semibold mb-4">
          Community Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <p className="mb-2">
              • Discussions Created :
              <span className="font-semibold ml-2">
                {stats.totalDiscussions}
              </span>
            </p>

            <p className="mb-2">
              • Comments Posted :
              <span className="font-semibold ml-2">
                {stats.totalComments}
              </span>
            </p>

            <p className="mb-2">
              • Study Groups :
              <span className="font-semibold ml-2">
                {stats.totalGroups}
              </span>
            </p>

          </div>

          <div>

            <p className="mb-2">
              • Group Messages :
              <span className="font-semibold ml-2">
                {stats.totalMessages}
              </span>
            </p>

            <p className="mb-2">
              • Registered Users :
              <span className="font-semibold ml-2">
                {stats.totalUsers}
              </span>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CommunityDashboard;