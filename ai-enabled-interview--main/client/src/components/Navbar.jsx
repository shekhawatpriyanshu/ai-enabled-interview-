import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaGraduationCap, FaUserTie, FaBell, FaVideo, FaTrash } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { getProfile } from "../services/ProfileService";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem("cached_profile");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const cached = localStorage.getItem("user_interview_notifications");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const loadNotifications = () => {
    try {
      const cached = localStorage.getItem("user_interview_notifications");
      setNotifications(cached ? JSON.parse(cached) : []);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    window.addEventListener("new_interview_notification", loadNotifications);
    return () => {
      window.removeEventListener("new_interview_notification", loadNotifications);
    };
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        if (data && data.profile) {
          setProfile(data.profile);
          localStorage.setItem("cached_profile", JSON.stringify(data.profile));
        }
      } catch (err) {
        console.log("Failed to fetch profile in navbar:", err);
      }
    };
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const userType = user?.userType || profile?.userType || "Student";
  const isProfessional = userType === "Working Professional";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenDropdown = () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown) {
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem("user_interview_notifications", JSON.stringify(updated));
    }
  };

  const handleClearNotifs = () => {
    setNotifications([]);
    localStorage.removeItem("user_interview_notifications");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-[#080c18]/95 backdrop-blur-xl border-b border-slate-800/90 text-slate-100 px-4 sm:px-6 py-2.5 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-xl transition-all duration-300 relative">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 via-purple-500 to-emerald-400" />

      {/* LEFT SECTION: Hamburger Toggle + Branding Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-200 cursor-pointer focus:outline-none"
          aria-label="Toggle Sidebar Navigation"
        >
          <FaBars className="text-xs" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <SiLeetcode className="text-lg text-white" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5 leading-none">
              <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                LeetChef
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              AI Interview Platform
            </p>
          </div>

          <h1 className="sm:hidden text-sm font-black tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              LeetChef
            </span>
          </h1>
        </div>
      </div>

      {/* RIGHT SECTION: Notifications + User Role Badge + Logout */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATION BELL ICON BUTTON */}
        <div className="relative">
          <button
            onClick={handleOpenDropdown}
            className="relative p-2 text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all duration-200 cursor-pointer shadow-inner"
            title="Interview Notifications"
          >
            <FaBell className="text-sm text-sky-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse border-2 border-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS DROPDOWN PANEL */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0b0f1d] backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-4 z-50 text-slate-100 space-y-3 animate-fade-in font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FaBell className="text-sky-400 text-xs" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Interview Notifications ({notifications.length})
                  </span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifs}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FaTrash className="text-[9px]" /> Clear
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs font-medium italic">
                    No live interview notifications saved yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="bg-slate-950/80 hover:bg-slate-900 p-3.5 rounded-2xl border border-slate-800/90 transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${notif.interviewType === "Live" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
                          {notif.interviewType === "Live" ? "🔴 Live Session" : `📅 Scheduled: ${notif.scheduledDate || "Upcoming"}`}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-slate-200 font-medium leading-snug">{notif.message}</p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] font-mono font-bold text-sky-400">
                          Room: {notif.roomId}
                        </span>
                        <button
                          onClick={() => {
                            setShowNotifDropdown(false);
                            navigate(`/interview-room/${notif.roomId}`);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm flex items-center space-x-1 cursor-pointer transition"
                        >
                          <FaVideo className="text-[9px]" />
                          <span>View Room</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Student vs Working Professional Badge Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-md transition-all duration-300 ${
          isProfessional
            ? "bg-slate-950 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500/20"
            : "bg-slate-950 border-indigo-500/40 text-indigo-200 ring-1 ring-indigo-500/20"
        }`}>
          {isProfessional ? (
            <>
              <FaUserTie className="text-cyan-400 text-xs" />
              <span className="text-[10px] font-black tracking-wider uppercase text-cyan-300">
                WORKING PROFESSIONAL
              </span>
            </>
          ) : (
            <>
              <FaGraduationCap className="text-indigo-400 text-xs" />
              <span className="text-[10px] font-black tracking-wider uppercase text-indigo-200">
                STUDENT
              </span>
            </>
          )}
        </div>

        {/* Logout Action Button */}
        <button
          onClick={handleLogout}
          className="group flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-slate-950 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-rose-500 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <FaSignOutAlt className="text-xs group-hover:rotate-12 transition-transform duration-300 text-rose-400 group-hover:text-white" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;