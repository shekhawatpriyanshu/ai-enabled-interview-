import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaMicrophone,
  FaUserTie,
  FaFileAlt,
  FaCode,
  FaHistory,
  FaQuestionCircle,
  FaClipboardList,
  FaComments,
  FaTrophy,
  FaChartBar,
  FaMedal,
  FaGift,
  FaSignOutAlt
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Start Interview", icon: <FaMicrophone />, path: "/interviews/start" },
    { name: "My Interviews", icon: <FaUserTie />, path: "/interviews" },
    { name: "Resume Analyzer", icon: <FaFileAlt />, path: "/resume-analyzer" },
    { name: "Coding Problems", icon: <FaCode />, path: "/coding" },
    { name: "My Submissions", icon: <FaHistory />, path: "/coding/submissions" },
    { name: "Question Bank", icon: <FaQuestionCircle />, path: "/question-bank/questions" },
    { name: "Mock Tests", icon: <FaClipboardList />, path: "/tests" },
    { name: "Community", icon: <FaComments />, path: "/community" },
    { name: "Contests", icon: <FaTrophy />, path: "/contests" },
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Achievements", icon: <FaMedal />, path: "/achievements" },
    { name: "Rewards", icon: <FaGift />, path: "/rewards" },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    if (path === "/resume-analyzer" && location.pathname.startsWith("/resume-report")) {
      return true;
    }
    // Prevent "/interviews" from matching "/interviews/start"
    if (path === "/interviews") {
      return location.pathname === "/interviews" || (location.pathname.startsWith("/interviews/") && !location.pathname.startsWith("/interviews/start"));
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 w-72 h-screen bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* PROFILE (Top Header) */}
      <div className="p-6 border-b border-slate-800 bg-slate-800/30 hover:bg-slate-800 transition-colors cursor-pointer group flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-xl font-bold uppercase shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300 text-white">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="overflow-hidden flex-1">
            <h2 className="text-base font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
              {user?.name || "User"}
            </h2>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {user?.email || "user@example.com"}
            </p>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Student
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
        {menu.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                active
                  ? "bg-cyan-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg group-hover:scale-110 transition">
                {item.icon}
              </span>

              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
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

export default Sidebar;