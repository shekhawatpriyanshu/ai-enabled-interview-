import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaGraduationCap, FaUserTie } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { getProfile } from "../services/ProfileService";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        if (data && data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.log("Failed to fetch profile in navbar:", err);
      }
    };
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isProfessional = profile?.userType === "Working Professional";

  return (
    <header className="bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 backdrop-blur-xl border-b border-indigo-100/80 px-4 sm:px-6 py-2.5 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-all duration-300 relative overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-indigo-600 via-purple-600 to-cyan-500" />
      
      {/* LEFT SECTION: Hamburger Toggle + Branding Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all duration-200 cursor-pointer focus:outline-none"
          aria-label="Toggle Sidebar Navigation"
        >
          <FaBars className="text-xs" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
            <SiLeetcode className="text-lg text-white" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5 leading-none">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                LeetChef
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-200">
                PRO
              </span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              AI Interview Platform
            </p>
          </div>

          <h1 className="sm:hidden text-sm font-black tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              LeetChef
            </span>
          </h1>
        </div>
      </div>

      {/* RIGHT SECTION: User Role Pill Badge + Logout Button */}
      <div className="flex items-center gap-3">
        
        {/* Dynamic Student vs Working Professional Badge Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-md transition-all duration-300 ${
          isProfessional
            ? "bg-slate-900 border-cyan-500/50 text-cyan-300 ring-2 ring-cyan-500/20"
            : "bg-slate-900 border-indigo-500/50 text-indigo-200 ring-2 ring-indigo-500/20"
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
          className="group flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-slate-100 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 text-slate-700 hover:text-white font-bold text-xs border border-slate-200 hover:border-rose-500 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <FaSignOutAlt className="text-xs group-hover:rotate-12 transition-transform duration-300 text-rose-500 group-hover:text-white" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;