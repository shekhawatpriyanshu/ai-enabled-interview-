import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaCode,
  FaComments,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaRobot,
  FaQuestionCircle,
  FaLayerGroup,
  FaBuilding,
  FaClipboardList,
  FaTrophy,
  FaGift,
  FaAward,
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

  const menus = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },

    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Interviews", icon: <FaUserTie />, path: "/admin/interviews" },
    { name: "Coding", icon: <FaCode />, path: "/admin/coding" },
    { name: "Mock Tests", icon: <FaClipboardList />, path: "/admin/mock-tests" },
    { name: "Questions", icon: <FaQuestionCircle />, path: "/admin/questions" },
    { name: "Topics", icon: <FaLayerGroup />, path: "/admin/questions/topics" },
    { name: "Companies", icon: <FaBuilding />, path: "/admin/questions/companies" },
    { name: "Contests", icon: <FaTrophy />, path: "/admin/contests" },
    { name: "Community", icon: <FaComments />, path: "/admin/community" },
    { name: "Achievements", icon: <FaTrophy />, path: "/admin/achievement" },
    { name: "Rewards", icon: <FaGift />, path: "/admin/rewards/dashboard" },
    { name: "Badges", icon: <FaAward />, path: "/admin/badges" },
    { name: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-200 border-r border-slate-800/80 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* PROFILE (Top Header) */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group flex justify-between items-start">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-xl font-black uppercase shadow-lg shadow-indigo-500/30 ring-2 ring-cyan-400/30 shrink-0 group-hover:scale-110 transition-transform duration-300 text-white">
            {admin?.name?.charAt(0) || "A"}
          </div>

          <div className="overflow-hidden flex-1">
            <h2
              style={{ color: "#ffffff" }}
              className="text-base font-black text-white !text-white truncate group-hover:text-cyan-300 transition-colors tracking-wide"
            >
              {admin?.name ? admin.name : "Admin"}
            </h2>
            <p
              style={{ color: "#cbd5e1" }}
              className="text-xs text-slate-300 !text-slate-300 truncate mt-0.5 font-semibold"
            >
              {admin?.email || "admin@example.com"}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {admin?.role ? admin.role : "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-slate-400 hover:text-white shrink-0 mt-1 ml-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            end={menu.path === "/admin"}
            onClick={handleNavClick}
            className={({ isActive }) => {
              const active = isActive && !(menu.path === "/admin/questions" && (
                location.pathname.startsWith("/admin/questions/topics") ||
                location.pathname.startsWith("/admin/questions/companies")
              ));
              return `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 scale-[1.02] border-l-4 border-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1"
                }`;
            }}
          >
            <span className="text-lg shrink-0 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
              {menu.icon}
            </span>

            <span className="font-semibold text-sm tracking-wide">{menu.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800/40 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 text-slate-300 hover:text-white font-bold text-sm border border-slate-700/50 hover:border-rose-500 shadow-sm hover:shadow-lg hover:shadow-rose-600/25 active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          <FaSignOutAlt className="text-base group-hover:rotate-12 transition-transform" />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;