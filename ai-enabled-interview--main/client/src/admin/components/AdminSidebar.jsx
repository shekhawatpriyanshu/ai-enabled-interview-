import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaCode,
  FaComments,
  FaChartBar,
  FaSignOutAlt,
  FaRobot,
  FaQuestionCircle,
  FaLayerGroup,
  FaBuilding,
  FaClipboardList,
  FaTrophy,
  FaGift,
  FaAward,
  FaChevronRight,
  FaCrown,
} from "react-icons/fa";

import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const menuSections = [
    {
      title: "Core Overview",
      items: [
        { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        { name: "Users", icon: <FaUsers />, path: "/admin/users", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
        { name: "Analytics", icon: <FaChartBar />, path: "/admin/analytics", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
      ],
    },
    {
      title: "Content & Assessments",
      items: [
        { name: "Interviews", icon: <FaUserTie />, path: "/admin/interviews", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        { name: "Coding", icon: <FaCode />, path: "/admin/coding", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
        { name: "Mock Tests", icon: <FaClipboardList />, path: "/admin/mock-tests", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        { name: "Questions", icon: <FaQuestionCircle />, path: "/admin/questions", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
        { name: "Topics", icon: <FaLayerGroup />, path: "/admin/questions/topics", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
        { name: "Companies", icon: <FaBuilding />, path: "/admin/questions/companies", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
        { name: "Contests", icon: <FaTrophy />, path: "/admin/contests", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
        { name: "Community", icon: <FaComments />, path: "/admin/community", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
      ],
    },
    {
      title: "Gamification & Rewards",
      items: [
        { name: "Achievements", icon: <FaTrophy />, path: "/admin/achievement", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
        { name: "Rewards", icon: <FaGift />, path: "/admin/rewards/dashboard", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
        { name: "Badges", icon: <FaAward />, path: "/admin/badges", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20" },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 w-72 h-screen bg-slate-950 text-slate-100 border-r border-slate-800/80 flex flex-col shadow-2xl z-50 transform transition-all duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* PROMINENT & PERFECTLY ALIGNED ADMIN HEADER */}
      <div className="p-3.5 border-b border-slate-800/90 bg-slate-950 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-400 flex items-center justify-center font-black text-base text-white shadow-md shadow-indigo-500/30 ring-2 ring-cyan-400/40">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-black text-white tracking-tight shrink-0">
                Admin
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                <FaCrown className="text-amber-400 text-[9px]" />
                {admin?.role || "ADMIN"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-300 break-all leading-tight">
              {admin?.email || "admin@system.com"}
            </p>
          </div>
        </div>

        {/* Mobile Close */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 ml-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>{section.title}</span>
            </div>

            {section.items.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                end={menu.path === "/admin"}
                onClick={handleNavClick}
                className={({ isActive }) => {
                  const active =
                    isActive &&
                    !(
                      menu.path === "/admin/questions" &&
                      (location.pathname.startsWith("/admin/questions/topics") ||
                        location.pathname.startsWith("/admin/questions/companies"))
                    );

                  return `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide ${active
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold shadow-lg shadow-indigo-500/30 scale-[1.02] border-l-4 border-cyan-300"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/90 hover:translate-x-1.5 hover:shadow-md hover:border-slate-800 border border-transparent"
                    }`;
                }}
              >
                {({ isActive }) => {
                  const active =
                    isActive &&
                    !(
                      menu.path === "/admin/questions" &&
                      (location.pathname.startsWith("/admin/questions/topics") ||
                        location.pathname.startsWith("/admin/questions/companies"))
                    );

                  return (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 transition-all duration-300 ${active
                            ? "bg-white/20 border-white/30 text-white"
                            : `${menu.bg} ${menu.color} group-hover:scale-110 group-hover:rotate-6`
                            }`}
                        >
                          {menu.icon}
                        </div>
                        <span className="truncate">{menu.name}</span>
                      </div>

                      <FaChevronRight
                        className={`text-xs transition-all duration-300 shrink-0 ${active
                          ? "text-white opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-400"
                          }`}
                      />
                    </>
                  );
                }}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* LOGOUT FOOTER */}
      <div className="p-4 border-t border-slate-800/90 bg-slate-950">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-rose-600 hover:via-pink-600 hover:to-red-600 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-800 hover:border-rose-500 shadow-sm hover:shadow-lg hover:shadow-rose-600/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          <FaSignOutAlt className="text-sm group-hover:rotate-12 transition-transform duration-300 text-rose-400 group-hover:text-white" />
          <span>{loading ? "Signing out..." : "Logout "}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;