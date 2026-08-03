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

  // Fetch user details
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Toggle verification
  const toggleVerify = () => {
    setUser({ ...user, isVerified: !user.isVerified });
  };

  // Validate form
  const validate = () => {
    if (!user.name.trim()) return "Name is required";
    if (!user.email.trim()) return "Email is required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(user.email)) return "Invalid email format";

    return null;
  };

  // Submit update
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
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading user profile...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      {/* Header section */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate("/admin/users")}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Edit User Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update account details and verification status
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="p-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3 text-red-700 dark:text-red-400"
            >
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-lg flex items-center gap-3 text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle size={20} />
              <p className="font-medium">{success}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User size={16} className="text-blue-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:text-white"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:text-white"
                  placeholder="john@example.com"
                />
              </div>

              {/* Role Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Shield size={16} className="text-indigo-500" /> Account Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={user.role}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none cursor-not-allowed capitalize text-gray-500 dark:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Verification Toggle Section */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Verification Status</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manually mark this user's email as verified.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleVerify}
                  className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                    user.isVerified 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400" 
                      : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {user.isVerified ? (
                      <><CheckCircle size={18} /> Verified</>
                    ) : (
                      <><XCircle size={18} /> Unverified</>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto text-center"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all w-full sm:flex-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><Loader2 className="animate-spin" size={20} /> Saving Changes...</>
                ) : (
                  <><Save size={20} /> Save User Profile</>
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