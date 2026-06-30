import { NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  PlusCircle,
  BarChart3,
} from "lucide-react";

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
  return (
    <aside className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 flex flex-col justify-between">

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5 px-1 tracking-tight">
          Community
        </h2>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/community"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                <Icon size={18} />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Statistics Card */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white p-5 shadow-inner">

        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-cyan-400" />
          <h3 className="text-sm font-bold tracking-wide">
            COMMUNITY STATS
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300">

          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Discussions</span>
            <span className="font-bold text-white">--</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Study Groups</span>
            <span className="font-bold text-white">--</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Members</span>
            <span className="font-bold text-white">--</span>
          </div>

        </div>

        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
          Stats will automatically update as the community grows.
        </p>

      </div>

    </aside>
  );
};

export default CommunitySidebar;