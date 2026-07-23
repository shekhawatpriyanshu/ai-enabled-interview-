import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import { useAdminAuth } from "../context/AdminAuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const { admin, logout } = useAdminAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-white shadow-md flex items-center justify-between px-8 z-50">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="text-slate-500 text-sm">
          Welcome back, {admin?.name}
        </p>

      </div>

      {/* Center */}

      <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 w-[350px]">

        <FaSearch className="text-slate-400 mr-3" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-slate-700"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button className="relative">

          <FaBell className="text-2xl text-slate-600 hover:text-cyan-600 transition" />

          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">

            3

          </span>

        </button>

        {/* Profile */}

        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 hover:bg-slate-100 px-3 py-2 rounded-xl transition"
          >

            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">

              {admin?.name?.charAt(0).toUpperCase()}

            </div>

            <div className="text-left hidden md:block">

              <h3 className="font-semibold text-slate-800">

                {admin?.name}

              </h3>

              <p className="text-xs text-slate-500">

                {admin?.role}

              </p>

            </div>

            <FaChevronDown />

          </button>

          {/* Dropdown */}

          {open && (

            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border">

              <div className="p-4 border-b">

                <h3 className="font-semibold">

                  {admin?.name}

                </h3>

                <p className="text-sm text-slate-500">

                  {admin?.email}

                </p>

              </div>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 transition"
              >

                <FaUserCircle />

                My Profile

              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
              >

                <FaSignOutAlt />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;