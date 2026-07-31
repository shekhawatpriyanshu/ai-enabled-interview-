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
      className={`fixed left-0 top-0 w-72 h-screen bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* PROFILE (Top Header) */}
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 hover:bg-slate-800 transition-colors cursor-pointer group flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-xl font-bold uppercase shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300 text-white">
            {admin?.name?.charAt(0) || "A"}
          </div>

          <div className="overflow-hidden flex-1">
            <h2 className="text-base font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
              {admin?.name || "admin"}
            </h2>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {admin?.email || "[EMAIL_ADDRESS]"}
            </p>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {admin?.role || "admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-slate-400 hover:text-white shrink-0 mt-1 ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
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
              return `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${active
                  ? "bg-cyan-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`;
            }}
          >
            <span className="text-lg group-hover:scale-110 transition">
              {menu.icon}
            </span>

            <span className="font-medium">{menu.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 py-3 rounded-xl transition-all"
        >
          <FaSignOutAlt />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;