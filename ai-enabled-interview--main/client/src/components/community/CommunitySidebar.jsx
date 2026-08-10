import { NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  PlusCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const menuItems = [
  {
    title: "Community Home",
    path: "/community",
    icon: Home,
  },
  {
    title: "Discussions",
    path: "/community/discussions",
    icon: MessageSquare,
  },
  {
    title: "Study Groups",
    path: "/community/groups",
    icon: Users,
  },
  {
    title: "Create Discussion",
    path: "/community/create-discussion",
    icon: PlusCircle,
  },
  {
    title: "Create Group",
    path: "/community/create-group",
    icon: PlusCircle,
  },
];

const CommunitySidebar = () => {
  const { discussions, groups } = useCommunity();

  const totalDiscussions = discussions.length;
  const totalGroups = groups.length;

  const uniqueMembers = new Set();
  groups.forEach((g) => {
    g.members?.forEach((m) => {
      uniqueMembers.add(m._id || m);
    });
  });
  discussions.forEach((d) => {
    if (d.user?._id) {
      uniqueMembers.add(d.user._id);
    } else if (d.user) {
      uniqueMembers.add(d.user);
    }
  });

  const totalMembers = uniqueMembers.size || 1;

  return (
    <aside className="w-full bg-white border border-slate-200/90 rounded-3xl shadow-xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />

      <div>
        <div className="flex items-center gap-2 mb-5 px-1 pt-1">
          <Sparkles size={18} className="text-indigo-600 shrink-0" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Navigation
          </h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/community"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent hover:border-slate-200/80"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Statistics Box */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 text-white p-5 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <BarChart3 size={18} className="text-cyan-400 shrink-0" />
          <h3 className="text-xs font-black tracking-wider uppercase text-cyan-300">
            Community Stats
          </h3>
        </div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-300 relative z-10">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-slate-400">Discussions</span>
            <span className="font-extrabold text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 text-xs">{totalDiscussions}</span>
          </div>

          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-slate-400">Study Groups</span>
            <span className="font-extrabold text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 text-xs">{totalGroups}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Active Members</span>
            <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800/80 text-xs">{totalMembers}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
          <span>Live Metrics</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;