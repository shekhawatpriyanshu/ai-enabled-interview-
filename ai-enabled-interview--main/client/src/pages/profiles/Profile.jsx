import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBackendUrl } from "../../api/config";
import { Link, useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaTrashAlt,
  FaSpinner,
  FaTimes,
  FaShieldAlt,
  FaGraduationCap,
  FaUserTie,
  FaBuilding,
  FaBookOpen,
  FaBullseye,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCode,
  FaGithub,
  FaLinkedin,
  FaUserEdit,
  FaRocket,
  FaAlignLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getProfile, deleteProfile } from "../../services/ProfileService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.profile);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteHandler = async () => {
    setIsDeleting(true);
    try {
      await deleteProfile();
      setProfile(null);
      setShowDeleteModal(false);
      navigate("/profile");
    } catch (error) {
      console.error("Delete profile error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const githubUrl = profile?.github
    ? profile.github.startsWith("http")
      ? profile.github
      : `https://${profile.github}`
    : "#";

  const linkedinUrl = profile?.linkedin
    ? profile.linkedin.startsWith("http")
      ? profile.linkedin
      : `https://${profile.linkedin}`
    : "#";

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

  const isProfessional = profile?.userType === "Working Professional";

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10"
        >
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                User Profile
              </span>
            </h1>
            <p className="text-slate-500 text-xs font-semibold">
              Manage your personal student or working professional details & platform identity
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/profile/edit"
              className={`group px-5 py-2.5 rounded-2xl border font-black text-xs shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                !profile
                  ? "text-slate-400 border-slate-200 pointer-events-none bg-slate-100"
                  : "text-indigo-600 border-indigo-200 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
              }`}
            >
              <FaUserEdit className="text-sm group-hover:rotate-12 transition-transform duration-300" />
              <span>Edit Profile</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={!profile}
              className={`group px-5 py-2.5 rounded-2xl border font-black text-xs transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                !profile
                  ? "text-slate-400 border-slate-200 cursor-not-allowed bg-slate-100"
                  : "text-rose-600 border-rose-200 bg-white hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 hover:text-white hover:border-rose-600 hover:scale-105 active:scale-95 shadow-sm"
              }`}
            >
              <FaTrashAlt className="text-xs group-hover:rotate-12 transition-transform duration-300" />
              <span>Delete Profile</span>
            </button>
          </div>
        </motion.div>

        {profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative z-10"
          >
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/15 backdrop-blur-2xs" />
              {/* Decorative Accent Glow Lines */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 blur-2xl rounded-full pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-400/20 blur-xl rounded-full pointer-events-none" />
            </div>

            <div className="px-6 sm:px-10 pb-10">
              {/* Profile Avatar Header */}
              <div className="-mt-20 flex flex-col items-center text-center relative z-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <div className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white text-5xl font-black ring-4 ring-indigo-500/30 group-hover:ring-purple-500/50 group-hover:scale-105 transition-all duration-300 shadow-indigo-500/20">
                    {profile.avatar ? (
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
                      profile.user?.name?.charAt(0).toUpperCase() || "S"
                    )}
                  </div>
                </motion.div>

                <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{profile.user?.name}</span>
                  <FaCheckCircle className="text-indigo-600 text-lg" title="Verified Member" />
                </h2>

                <p className="text-slate-500 text-xs font-semibold mt-0.5">
                  {profile.user?.email}
                </p>

                {/* Profile Role Badges */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs transition-all duration-300 hover:scale-105 ${
                    isProfessional
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-cyan-500/20"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-indigo-500/20"
                  }`}>
                    {isProfessional ? <FaUserTie className="text-xs" /> : <FaGraduationCap className="text-xs" />}
                    <span>{profile.userType || "Student"}</span>
                  </span>

                  {profile.targetRole && (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-200 shadow-2xs">
                      <FaBullseye className="text-amber-500 text-xs" />
                      <span>{profile.targetRole}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                
                {/* Professional Bio Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group md:col-span-2 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 p-6 rounded-3xl border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <FaAlignLeft className="text-xs" />
                      </div>
                      <span>Professional Bio</span>
                    </h3>
                  </div>
                  <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                    {profile.bio || "No professional bio added yet. Click 'Edit Profile' to share your story."}
                  </p>
                </motion.div>

                {/* Dynamic Education vs Work Cards */}
                {isProfessional ? (
                  <>
                    {/* Current Company Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/50 p-6 rounded-3xl border border-cyan-200/80 shadow-xs hover:shadow-md hover:border-cyan-400 transition-all duration-300"
                    >
                      <h3 className="text-xs font-black uppercase tracking-wider text-cyan-700 flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FaBuilding className="text-xs" />
                        </div>
                        <span>Current Company</span>
                      </h3>
                      <p className="text-slate-900 text-lg font-black tracking-tight">
                        {profile.company || "Not Specified"}
                      </p>
                    </motion.div>

                    {/* Job Title Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 p-6 rounded-3xl border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all duration-300"
                    >
                      <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FaUserTie className="text-xs" />
                        </div>
                        <span>Designation / Title</span>
                      </h3>
                      <p className="text-slate-900 text-lg font-black tracking-tight">
                        {profile.designation || "Not Specified"}
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* College Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/50 p-6 rounded-3xl border border-purple-200/80 shadow-xs hover:shadow-md hover:border-purple-400 transition-all duration-300"
                    >
                      <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FaGraduationCap className="text-xs" />
                        </div>
                        <span>College / University</span>
                      </h3>
                      <p className="text-slate-900 text-lg font-black tracking-tight">
                        {profile.college || "Not Specified"}
                      </p>
                    </motion.div>

                    {/* Degree Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group bg-gradient-to-br from-indigo-50/90 via-white to-cyan-50/50 p-6 rounded-3xl border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all duration-300"
                    >
                      <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FaBookOpen className="text-xs" />
                        </div>
                        <span>Degree / Major</span>
                      </h3>
                      <p className="text-slate-900 text-lg font-black tracking-tight">
                        {profile.degree || "Not Specified"}
                      </p>
                    </motion.div>
                  </>
                )}

                {/* Experience Level Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 p-6 rounded-3xl border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-300"
                >
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <FaBriefcase className="text-xs" />
                    </div>
                    <span>Experience Level</span>
                  </h3>
                  <p className="text-slate-900 text-lg font-black tracking-tight">
                    {profile.experience || "Not Specified"}
                  </p>
                </motion.div>

                {/* Location Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-gradient-to-br from-rose-50/90 via-white to-pink-50/50 p-6 rounded-3xl border border-rose-200/80 shadow-xs hover:shadow-md hover:border-rose-400 transition-all duration-300"
                >
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <FaMapMarkerAlt className="text-xs" />
                    </div>
                    <span>Location</span>
                  </h3>
                  <p className="text-slate-900 text-lg font-black tracking-tight">
                    {profile.location || "Not Specified"}
                  </p>
                </motion.div>
              </div>

              {/* Skills Chips Grid */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group mt-6 bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/50 p-6 rounded-3xl border border-cyan-200/80 shadow-xs hover:shadow-md hover:border-cyan-400 transition-all duration-300"
              >
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-700 flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <FaCode className="text-xs" />
                  </div>
                  <span>Technical & Upskilling Skills</span>
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-2xl bg-white border border-indigo-200/90 text-indigo-700 font-extrabold text-xs shadow-2xs hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer transition-all duration-300"
                      >
                        {skill}
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs font-semibold">No technical skills added yet.</p>
                  )}
                </div>
              </motion.div>

              {/* Social Connect Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.github && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg shadow-slate-900/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <FaGithub className="text-lg group-hover:scale-110 transition-transform duration-300" />
                    <span>View GitHub Profile</span>
                    <FaExternalLinkAlt className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </a>
                )}

                {profile.linkedin && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <FaLinkedin className="text-lg group-hover:scale-110 transition-transform duration-300" />
                    <span>View LinkedIn Profile</span>
                    <FaExternalLinkAlt className="text-[10px] text-blue-200 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <FaRocket className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                No Profile Created Yet
              </h2>
              <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
                Set up your student or professional profile to showcase your skills and prepare for AI interviews.
              </p>
            </div>

            <Link
              to="/profile/create"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Create Profile Now</span>
            </Link>
          </div>
        )}

        {/* Simple Clean Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center relative overflow-hidden text-slate-800"
              >
                {/* Top Accent Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />

                {/* Delete Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <FaTrashAlt className="text-lg" />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Delete Profile?
                </h3>
                <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed px-2">
                  Are you sure you want to delete your profile? This action cannot be undone.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all duration-200 cursor-pointer border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteHandler}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <FaSpinner className="animate-spin text-xs" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Profile;