import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBackendUrl } from "../../api/config";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserEdit } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import ProfileForm from "../../components/profile/ProfileForm";

import {
  getProfile,
  updateProfile,
} from "../../services/ProfileService";

const EditProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      if (!data.profile) {
        navigate("/profile/create");
        return;
      }

      setProfile(data.profile);
    } catch (error) {
      navigate("/profile/create");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateProfile(formData);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to save profile. Please check your network or image format.");
    }
  };

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Profile Details...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Floating Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Back Link Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Link
            to="/profile"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow-md font-extrabold text-xs transition-all duration-300"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200 text-indigo-600 text-xs" />
            <span>Back to Profile</span>
          </Link>
        </motion.div>

        {/* Header Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-fuchsia-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden"
        >
          {/* Top Multi-tone Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-400" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shrink-0 ring-4 ring-indigo-500/30">
              {profile?.avatar ? (
                <img
                  src={
                    profile.avatar.startsWith("http")
                      ? profile.avatar
                      : `${getBackendUrl()}/${profile.avatar.replace(/\\/g, "/")}`
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.user?.name?.charAt(0).toUpperCase() || "S"
              )}
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <FaUserEdit className="text-indigo-600 text-xs" />
                <span>Account Preferences</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  Edit Profile
                </span>
              </h1>
              <p className="text-slate-600 text-sm font-semibold leading-relaxed max-w-xl">
                Update your personal info, professional bio, skills, and social handles to boost your hireability score.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden z-10"
        >
          <div className="mb-8 pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm" />
              <span>Profile Information</span>
            </h2>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1 rounded-full shadow-xs">
              Student Details
            </span>
          </div>

          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;