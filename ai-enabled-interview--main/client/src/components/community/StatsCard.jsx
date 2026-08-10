import {
  MessageSquare,
  Users,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const StatsCard = () => {
  const { discussions, groups } = useCommunity();

  const totalDiscussions = discussions.length;
  const totalGroups = groups.length;
  const totalComments = discussions.reduce(
    (sum, discussion) => sum + (discussion.comments?.length || 0),
    0
  );

  const statCards = [
    {
      title: "Discussions",
      value: totalDiscussions,
      icon: <MessageSquare size={20} />,
      gradient: "from-cyan-600 to-blue-600",
      cardBg: "bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/40 border-cyan-200/90",
      topAccent: "bg-gradient-to-r from-cyan-500 to-blue-600",
      iconBg: "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-500/30",
    },
    {
      title: "Study Groups",
      value: totalGroups,
      icon: <Users size={20} />,
      gradient: "from-emerald-600 to-teal-600",
      cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-200/90",
      topAccent: "bg-gradient-to-r from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30",
    },
    {
      title: "Comments",
      value: totalComments,
      icon: <MessageCircle size={20} />,
      gradient: "from-purple-600 to-indigo-600",
      cardBg: "bg-gradient-to-br from-purple-50/90 via-white to-indigo-50/40 border-purple-200/90",
      topAccent: "bg-gradient-to-r from-purple-500 to-indigo-600",
      iconBg: "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/30",
    },
    {
      title: "Growth Index",
      value: totalDiscussions + totalGroups,
      icon: <TrendingUp size={20} />,
      gradient: "from-amber-600 to-orange-600",
      cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-200/90",
      topAccent: "bg-gradient-to-r from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((card) => (
        <div
          key={card.title}
          className={`group ${card.cardBg} rounded-3xl border p-5 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-default min-h-[140px]`}
        >
          {/* Top Accent Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.topAccent}`} />

          {/* Top Row: Icon Badge */}
          <div className="flex items-center justify-between pt-1 mb-3">
            <div
              className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0`}
            >
              {card.icon}
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
              Live
            </span>
          </div>

          {/* Bottom Row: Title + Number */}
          <div className="space-y-0.5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 leading-snug">
              {card.title}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent tracking-tight`}>
              {card.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;