import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaComments,
  FaUsers,
  FaLayerGroup,
  FaCommentDots,
  FaArrowRight,
  FaChartLine,
  FaGlobe,
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
      bg: "bg-gradient-to-br from-cyan-50/90 via-blue-50/40 to-white hover:from-cyan-100/90 hover:to-blue-50",
      border: "border-cyan-200/90 hover:border-cyan-400",
      iconBg: "bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30",
      btnColor: "text-cyan-600 group-hover:translate-x-1.5",
      link: "/admin/community/discussions",
    },
    {
      title: "Manage Comments",
      icon: <FaCommentDots />,
      bg: "bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white hover:from-purple-100/90 hover:to-fuchsia-50",
      border: "border-purple-200/90 hover:border-purple-400",
      iconBg: "bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-purple-500/30",
      btnColor: "text-purple-600 group-hover:translate-x-1.5",
      link: "/admin/community/comments",
    },
    {
      title: "Manage Groups",
      icon: <FaLayerGroup />,
      bg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white hover:from-emerald-100/90 hover:to-teal-50",
      border: "border-emerald-200/90 hover:border-emerald-400",
      iconBg: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30",
      btnColor: "text-emerald-600 group-hover:translate-x-1.5",
      link: "/admin/community/groups",
    },
    {
      title: "Manage Messages",
      icon: <FaUsers />,
      bg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white hover:from-amber-100/90 hover:to-orange-50",
      border: "border-amber-200/90 hover:border-amber-400",
      iconBg: "bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-amber-500/30",
      btnColor: "text-amber-600 group-hover:translate-x-1.5",
      link: "/admin/community/messages",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-bounce">
              <FaGlobe />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Community Dashboard
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Manage discussions, study groups, comments and member interactions.
          </p>
        </div>
      </div>

      {/* Key Stats Bar */}
      <CommunityStats loading={loading} stats={stats} />

      {/* Analytics Overview Cards */}
      <div className="mt-8">
        <AnalyticsCards stats={stats} />
      </div>

      {/* Quick Actions Showcase */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FaChartLine className="text-purple-600" /> Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {quickActions.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`rounded-2xl border ${item.border} ${item.bg} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between`}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                <h3 className="font-black text-lg text-slate-900 mt-4 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider mt-6 ${item.btnColor} transition-all`}>
                Open Management <FaArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Overview Summary */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          Community Engagement Summary
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">Discussions Created:</span>
              <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {stats.totalDiscussions}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">Comments Posted:</span>
              <span className="text-sm font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                {stats.totalComments}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">Active Study Groups:</span>
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {stats.totalGroups}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">Group Messages:</span>
              <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {stats.totalMessages}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">Registered Community Users:</span>
              <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                {stats.totalUsers}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;