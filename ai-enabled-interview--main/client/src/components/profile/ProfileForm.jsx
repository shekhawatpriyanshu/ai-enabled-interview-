import { useState, useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaCamera,
  FaAlignLeft
} from "react-icons/fa";

const ProfileForm = ({ initialData, onSubmit }) => {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    bio: initialData?.bio || "",
    college: initialData?.college || "",
    skills: initialData?.skills?.join(", ") || "",
    github: initialData?.github || "",
    linkedin: initialData?.linkedin || "",
    experience: initialData?.experience || "",
    location: initialData?.location || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (avatar) {
      formData.append("avatar", avatar);
    }

    // Clean up skills string to array format on backend
    const cleanedSkills = form.skills
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(",");

    formData.append("bio", form.bio);
    formData.append("college", form.college);
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
      {/* Image Upload Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 flex items-center justify-center relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : initialData?.avatar ? (
              <img
                src={initialData.avatar.startsWith("http") ? initialData.avatar : `/${initialData.avatar}`}
                alt="Current Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera className="text-3xl text-slate-400" />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCamera className="text-white text-xl" />
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
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-slate-800">Profile Photo</h3>
          <p className="text-sm text-slate-500 mt-1">Upload a professional picture (JPG, PNG).</p>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
          >
            Change Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bio spanning full width */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaAlignLeft className="text-slate-400" />
            Professional Bio
          </label>
          <textarea
            required
            placeholder="Tell us about yourself, your goals, and what you love to do..."
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-4 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none min-h-[120px]"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaMapMarkerAlt className="text-slate-400" />
            Location
          </label>
          <input
            type="text"
            required
            placeholder="e.g. San Francisco, CA"
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* College */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaGraduationCap className="text-slate-400" />
            College / University
          </label>
          <input
            type="text"
            required
            placeholder="Where did you study?"
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={form.college}
            onChange={(e) => setForm({ ...form, college: e.target.value })}
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaBriefcase className="text-slate-400" />
            Experience
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 2 years as Frontend Dev"
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaCode className="text-slate-400" />
            Skills
          </label>
          <input
            type="text"
            required
            placeholder="React, Node.js, Python (comma separated)"
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </div>

        {/* Github */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaGithub className="text-slate-400" />
            GitHub URL
          </label>
          <input
            type="text"
            required
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="github.com/username"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaLinkedin className="text-slate-400" />
            LinkedIn URL
          </label>
          <input
            type="text"
            required
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3.5 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="linkedin.com/in/username"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>

      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Profile...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;