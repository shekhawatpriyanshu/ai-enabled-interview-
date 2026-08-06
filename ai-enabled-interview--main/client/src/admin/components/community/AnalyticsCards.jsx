import { FaChartLine, FaCommentDots, FaLayerGroup } from "react-icons/fa";

const AnalyticsCards = ({ stats }) => {
  const discussionPercent =
    stats.totalUsers > 0
      ? ((stats.totalDiscussions / stats.totalUsers) * 100).toFixed(1)
      : 0;

  const commentPercent =
    stats.totalDiscussions > 0
      ? (stats.totalComments / stats.totalDiscussions).toFixed(1)
      : 0;

  const messagePercent =
    stats.totalGroups > 0
      ? (stats.totalMessages / stats.totalGroups).toFixed(1)
      : 0;

  const analytics = [
    {
      title: "User Participation",
      value: `${discussionPercent}%`,
      subtitle: "Discussions per registered user",
      icon: <FaChartLine />,
      bg: "bg-gradient-to-br from-blue-50/90 via-cyan-50/40 to-white hover:from-blue-100/90 hover:to-cyan-50",
      border: "border-blue-200/90 hover:border-blue-400",
      iconBg: "bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-blue-500/30",
      titleColor: "group-hover:text-blue-600",
      valueColor: "from-blue-600 to-cyan-600",
    },
    {
      title: "Discussion Engagement",
      value: commentPercent,
      subtitle: "Average comments per discussion",
      icon: <FaCommentDots />,
      bg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white hover:from-emerald-100/90 hover:to-teal-50",
      border: "border-emerald-200/90 hover:border-emerald-400",
      iconBg: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30",
      titleColor: "group-hover:text-emerald-600",
      valueColor: "from-emerald-600 to-teal-600",
    },
    {
      title: "Group Activity",
      value: messagePercent,
      subtitle: "Average messages per group",
      icon: <FaLayerGroup />,
      bg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white hover:from-amber-100/90 hover:to-orange-50",
      border: "border-amber-200/90 hover:border-amber-400",
      iconBg: "bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-amber-500/30",
      titleColor: "group-hover:text-amber-600",
      valueColor: "from-orange-600 to-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {analytics.map((item, index) => (
        <div
          key={index}
          className={`rounded-3xl border ${item.border} ${item.bg} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`text-base font-black text-slate-900 ${item.titleColor} transition-colors leading-tight`}>
                {item.title}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center text-xl shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
              {item.icon}
            </div>
          </div>

          <div>
            <p className={`text-4xl font-black bg-gradient-to-r ${item.valueColor} bg-clip-text text-transparent`}>
              {item.value}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;