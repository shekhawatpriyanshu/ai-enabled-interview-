import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaHeading,
  FaTags,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";

import useCommunity from "../../hooks/useCommunity";

const DiscussionForm = () => {
  const navigate = useNavigate();
  const { createNewDiscussion, loading } = useCommunity();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
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

    if (!formData.title.trim())
      return setError("Title is required.");

    if (!formData.content.trim())
      return setError("Content is required.");

    try {
      await createNewDiscussion({
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setFormData({
        title: "",
        content: "",
        tags: "",
      });

      navigate("/community/discussions");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create discussion."
      );
    }
  };

  return (
    <div className="w-full relative">
      {/* Decorative Blurs */}
      <div className="absolute -top-10 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden relative z-10">

        {/* Header */}
        <div className="p-8 md:p-10 border-b border-gray-100/50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:rotate-6 transition-transform duration-300">
              <FaComments size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-1">
                Start a Discussion
              </h1>
              <p className="text-gray-500 font-medium">
                Ask questions, share ideas, and help the community grow.
              </p>
            </div>
          </div>
        </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-300 text-red-700 px-5 py-4 animate-pulse">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="group">
              <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                <FaHeading className="text-blue-500" />
                Discussion Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Best way to prepare for DSA interviews?"
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-5 py-4 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-sm placeholder-gray-400"
              />
              <div className="text-right mt-1.5 text-sm text-gray-400 font-medium">
                {formData.title.length}/100
              </div>
            </div>

            {/* Content */}
            <div className="group">
              <label className="block mb-2 font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                Discussion Description
              </label>
              <textarea
                rows={7}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe your question or share your knowledge..."
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-5 py-4 resize-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm placeholder-gray-400"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-gray-400 text-sm font-medium">
                  Markdown supported
                </span>
                <span className="text-gray-400 text-sm font-medium">
                  {formData.content.length} chars
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="group">
              <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 group-hover:text-teal-600 transition-colors">
                <FaTags className="text-teal-500" />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, System Design"
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-5 py-4 focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-300 shadow-sm placeholder-gray-400"
              />
              <p className="text-sm text-gray-500 mt-2 font-medium">
                Separate tags using commas.
              </p>
              
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100/50">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                <FaArrowLeft />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95"
                }`}
              >
                <FaPaperPlane />
                {loading ? "Creating..." : "Create Discussion"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default DiscussionForm;