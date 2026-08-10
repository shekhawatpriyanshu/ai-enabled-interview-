import { useState, useRef, useEffect } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaCamera,
  FaAlignLeft,
  FaSave,
  FaSpinner,
  FaBuilding,
  FaUserTie,
  FaBullseye,
  FaBookOpen,
  FaCheck,
  FaTrash,
} from "react-icons/fa";


const ProfileForm = ({ initialData, onSubmit }) => {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [userType, setUserType] = useState(initialData?.userType || "Student");

  const [form, setForm] = useState({
    bio: initialData?.bio || "",
    college: initialData?.college || "",
    degree: initialData?.degree || "",
    company: initialData?.company || "",
    designation: initialData?.designation || "",
    targetRole: initialData?.targetRole || "",
    skills: Array.isArray(initialData?.skills) ? initialData.skills.join(", ") : initialData?.skills || "",
    github: initialData?.github || "",
    linkedin: initialData?.linkedin || "",
    experience: initialData?.experience || "",
    location: initialData?.location || "",
  });

  useEffect(() => {
    if (initialData) {
      if (initialData.userType) {
        setUserType(initialData.userType);
      }
      setForm({
        bio: initialData.bio || "",
        college: initialData.college || "",
        degree: initialData.degree || "",
        company: initialData.company || "",
        designation: initialData.designation || "",
        targetRole: initialData.targetRole || "",
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : initialData.skills || "",
        github: initialData.github || "",
        linkedin: initialData.linkedin || "",
        experience: initialData.experience || "",
        location: initialData.location || "",
      });
    }
  }, [initialData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setRemoveAvatar(false);
    }
  };

  const handleDeleteImage = () => {
    setAvatar(null);
    setAvatarPreview("REMOVED");
    setRemoveAvatar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (avatar) {
      formData.append("avatar", avatar);
    } else if (removeAvatar) {
      formData.append("removeAvatar", "true");
    }

    const cleanedSkills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .join(",");

    formData.append("userType", userType);
    formData.append("bio", form.bio);
    formData.append("college", form.college);
    formData.append("degree", form.degree);
    formData.append("company", form.company);
    formData.append("designation", form.designation);
    formData.append("targetRole", form.targetRole);
    formData.append("skills", cleanedSkills);
    formData.append("github", form.github);
    formData.append("linkedin", form.linkedin);
    formData.append("experience", form.experience);
    formData.append("location", form.location);

    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={submitHandler} className="space-y-8">
      
      {/* PROFILE TYPE SELECTION: Student vs Working Professional */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
            1. Select Your Current Status
          </label>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase">
            Active Selection: {userType}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Student Selection Card */}
          <div
            onClick={() => setUserType("Student")}
            className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
              userType === "Student"
                ? "bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                : "bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110 ${
                    userType === "Student"
                      ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <FaGraduationCap />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Student</span>
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Studying in college / preparing for entry roles
                  </p>
                </div>
              </div>

              {userType === "Student" && (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <FaCheck />
                </div>
              )}
            </div>
          </div>

          {/* Working Professional Selection Card */}
          <div
            onClick={() => setUserType("Working Professional")}
            className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
              userType === "Working Professional"
                ? "bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/60 border-cyan-500 shadow-md ring-2 ring-cyan-500/20"
                : "bg-slate-50/80 border-slate-200 hover:border-cyan-300 hover:bg-white hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110 ${
                    userType === "Working Professional"
                      ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <FaUserTie />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Working Professional</span>
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Working in company & upskilling for growth
                  </p>
                </div>
              </div>

              {userType === "Working Professional" && (
                <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <FaCheck />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Box */}
      <div className="group p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center gap-6 shadow-xl hover:shadow-2xl hover:border-indigo-400/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <div
          className="relative group/avatar cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-800 flex items-center justify-center relative ring-4 ring-cyan-400/40 group-hover/avatar:ring-fuchsia-400/60 transition-all duration-300 group-hover/avatar:scale-105">
            {avatarPreview && avatarPreview !== "REMOVED" ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : initialData?.avatar && !removeAvatar ? (
              <img
                src={initialData.avatar.startsWith("http") ? initialData.avatar : `/${initialData.avatar}`}
                alt="Current Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera className="text-3xl text-cyan-300" />
            )}

            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
              <FaCamera className="text-white text-2xl" />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">Profile Photo</h3>
          <p className="text-xs font-medium text-slate-300 max-w-sm">
            Upload a high-resolution avatar or clear your profile photo.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <FaCamera className="text-xs" />
              <span>Upload New Photo</span>
            </button>

            {(avatar || (initialData?.avatar && !removeAvatar)) && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                <FaTrash className="text-xs text-white shrink-0" />
                <span>Delete Photo</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic Fields Section Header */}
      <div className="space-y-1">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
          2. {userType === "Student" ? "Student Education & Career Details" : "Working Professional Details"}
        </label>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bio spanning full width */}
        <div className="group md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaAlignLeft className="text-xs" />
            </div>
            <span>Professional Bio</span>
          </label>
          <textarea
            required
            placeholder="Tell us about yourself, your goals, and your passion for coding..."
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-300 focus:bg-white rounded-2xl p-4 transition-all duration-200 focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none resize-none min-h-[100px] text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* DYNAMIC ROLE FIELDS */}
        {userType === "Student" ? (
          <>
            {/* College */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaGraduationCap className="text-xs" />
                </div>
                <span>College / University</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University, IIT Delhi"
                className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-purple-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
              />
            </div>

            {/* Degree / Branch */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaBookOpen className="text-xs" />
                </div>
                <span>Degree / Major</span>
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science (2025)"
                className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>
          </>
        ) : (
          <>
            {/* Company / Organization */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-cyan-600 transition-colors">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaBuilding className="text-xs" />
                </div>
                <span>Current Company</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Amazon, or Freelance"
                className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-cyan-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            {/* Designation / Job Title */}
            <div className="group space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaUserTie className="text-xs" />
                </div>
                <span>Job Title / Designation</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Experience Level */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaBriefcase className="text-xs" />
            </div>
            <span>Experience Level</span>
          </label>
          <input
            type="text"
            required
            placeholder={userType === "Student" ? "e.g. Fresher / Intern / Final Year" : "e.g. 3+ Years in Fullstack Dev"}
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-emerald-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>

        {/* Target Role / Upskilling Goal */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaBullseye className="text-xs" />
            </div>
            <span>Target Role / Upskilling Goal</span>
          </label>
          <input
            type="text"
            placeholder="e.g. SDE-2 Interview Prep, Upskilling in System Design"
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-amber-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            value={form.targetRole}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
          />
        </div>

        {/* Technical Skills */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-cyan-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaCode className="text-xs" />
            </div>
            <span>Technical Skills</span>
          </label>
          <input
            type="text"
            required
            placeholder="React, Node.js, Python, DSA, System Design (comma separated)"
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-cyan-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-rose-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaMapMarkerAlt className="text-xs" />
            </div>
            <span>Location</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. San Francisco, CA or Remote"
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-rose-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* Github */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-slate-900 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-md shadow-slate-700/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaGithub className="text-xs" />
            </div>
            <span>GitHub Profile</span>
          </label>
          <input
            type="text"
            required
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-400 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-slate-500/15 focus:border-slate-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            placeholder="https://github.com/username"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
        </div>

        {/* LinkedIn */}
        <div className="group space-y-2">
          <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FaLinkedin className="text-xs" />
            </div>
            <span>LinkedIn Profile</span>
          </label>
          <input
            type="text"
            required
            className="w-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-blue-300 focus:bg-white rounded-2xl p-3.5 transition-all duration-200 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-xs hover:shadow-sm"
            placeholder="https://linkedin.com/in/username"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>
      </div>

      {/* Submit Button Section */}
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black text-sm tracking-wide shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2.5"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Saving Profile Changes...</span>
            </>
          ) : (
            <>
              <FaSave className="text-base group-hover:rotate-12 transition-transform duration-300" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;