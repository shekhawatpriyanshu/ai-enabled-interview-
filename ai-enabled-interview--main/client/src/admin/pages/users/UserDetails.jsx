import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";

import { getUser } from "../../services/userService";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await getUser(id);
      setUser(res.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading User Details...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        User Not Found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Users List
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/90 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-10 mt-2">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white/20 hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-4xl shadow-xl border-4 border-white/20 hover:scale-105 transition-transform">
                <FaUser />
              </div>
            )}

            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {user.name}
              </h1>
              <p className="text-sm text-cyan-200/90 font-medium">
                {user.email}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-white/10 text-white backdrop-blur-md border border-white/20">
                  Role: {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-8">
          <div className="space-y-4">
            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-all duration-300 border border-slate-100 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Email Address
                </h4>
                <p className="text-slate-800 font-medium text-sm mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 transition-all duration-300 border border-slate-100 hover:border-purple-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FaUserShield className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Account Role
                </h4>
                <p className="capitalize text-slate-800 font-medium text-sm mt-0.5">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50/50 transition-all duration-300 border border-slate-100 hover:border-cyan-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FaCalendarAlt className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Joined Date
                </h4>
                <p className="text-slate-800 font-medium text-sm mt-0.5">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 transition-all duration-300 border border-slate-100 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FaCheckCircle className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Verification Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.isVerified
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/50 transition-all duration-300 border border-slate-100 hover:border-rose-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FaBan className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Account Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.isBlocked
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;