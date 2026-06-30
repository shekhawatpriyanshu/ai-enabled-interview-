import {
  MessageSquare,
  Users,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const StatsCard = () => {
  const {
    discussions,
    groups,
    comments,
  } = useCommunity();

  const totalDiscussions = discussions.length;
  const totalGroups = groups.length;
  const totalComments = comments.length;

  const stats = [
    {
      title: "Discussions",
      value: totalDiscussions,
      icon: MessageSquare,
      color: "bg-cyan-50 text-cyan-600 border border-cyan-100/60",
    },
    {
      title: "Study Groups",
      value: totalGroups,
      icon: Users,
      color: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    },
    {
      title: "Comments",
      value: totalComments,
      icon: MessageCircle,
      color: "bg-purple-50 text-purple-600 border border-purple-100/60",
    },
    {
      title: "Growth Index",
      value: `${totalDiscussions + totalGroups}`,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600 border border-amber-100/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  {stat.title}
                </p>

                <h2 className="text-3xl font-extrabold mt-2 text-slate-800 tracking-tight">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center`}
              >
                <Icon size={24} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default StatsCard;