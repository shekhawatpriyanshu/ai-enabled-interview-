import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const GroupForm = () => {
  const navigate = useNavigate();

  const { createNewGroup, loading } = useCommunity();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      return setError("Group name is required.");
    }

    if (!formData.description.trim()) {
      return setError("Group description is required.");
    }

    try {
      await createNewGroup(formData);

      setFormData({
        name: "",
        description: "",
      });

      navigate("/community/groups");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create study group."
      );
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-10 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-5 mb-10 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transform hover:rotate-6 transition-transform duration-300">
          <Users size={32} />
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-1">
            Create Study Group
          </h2>
          <p className="text-gray-500 font-medium">
            Build a community, share knowledge, and learn together.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 relative z-10"
      >
        {/* Group Name */}
        <div className="group">
          <label className="block mb-2 font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
            Group Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. System Design Interview Prep"
            className="w-full rounded-xl border border-gray-200 bg-white/50 px-5 py-4 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm placeholder-gray-400"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label className="block mb-2 font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
            Description
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what your group will study, schedule, prerequisites..."
            className="w-full rounded-xl border border-gray-200 bg-white/50 px-5 py-4 resize-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 shadow-sm placeholder-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl text-white font-bold transition-all duration-300 shadow-lg text-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95"
            }`}
          >
            {loading
              ? "Creating..."
              : "Create Group ✨"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default GroupForm;