import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../services/userService";
import { motion } from "framer-motion";
import { User, Mail, Shield, CheckCircle, XCircle, ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
    isVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUser(id);
        const data = res.user;

        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          isVerified: data.isVerified,
        });
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const toggleVerify = () => {
    setUser({ ...user, isVerified: !user.isVerified });
  };

  const validate = () => {
    if (!user.name.trim()) return "Name is required";
    if (!user.email.trim()) return "Email is required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(user.email)) return "Invalid email format";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateUser(id, user);

      setSuccess("User updated successfully!");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider animate-pulse">Loading User Profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Header section */}
      <div className="flex items-center gap-4 border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="group p-2.5 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 transition-all text-slate-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Edit User Profile
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Update account details and manual email verification status.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <div className="p-6 sm:p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl flex items-center gap-3 text-rose-700 font-semibold text-xs"
            >
              <AlertCircle size={18} />
              <p>{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl flex items-center gap-3 text-emerald-700 font-semibold text-xs"
            >
              <CheckCircle size={18} />
              <p>{success}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <User size={15} className="text-indigo-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-800 font-semibold text-sm shadow-xs"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Mail size={15} className="text-purple-600" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-800 font-semibold text-sm shadow-xs"
                  placeholder="john@example.com"
                />
              </div>

              {/* Role Input */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Shield size={15} className="text-cyan-600" /> Account Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={user.role}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 outline-none cursor-not-allowed capitalize text-slate-500 font-semibold text-sm"
                />
              </div>
            </div>

            {/* Verification Toggle Section */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Verification Status</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Manually mark candidate's email verification status.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleVerify}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer ${user.isVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {user.isVerified ? (
                      <><CheckCircle size={16} /> Verified</>
                    ) : (
                      <><XCircle size={16} /> Unverified</>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 pt-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <><Loader2 className="animate-spin" size={16} /> Saving Profile...</>
                ) : (
                  <><Save size={16} /> Edit User Profile</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditUser;