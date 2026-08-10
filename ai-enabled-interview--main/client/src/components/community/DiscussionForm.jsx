import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeading,
  FaTags,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { Sparkles, MessageSquare } from "lucide-react";

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
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden relative z-10">
        {/* Top Multi-Color Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0 transform hover:rotate-6 transition-transform duration-300">
              <MessageSquare size={24} className="shrink-0" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-800 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles size={11} className="text-purple-600 animate-pulse shrink-0" />
                <span>New Discussion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Start a Discussion
              </h1>
              <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">
                Ask questions, share technical insights, and collaborate with the community.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 font-semibold text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div className="group">
            <label className="flex items-center gap-2 mb-2 font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              <FaHeading className="text-indigo-600 shrink-0" />
              Discussion Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Best way to prepare for DSA & System Design interviews?"
              className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 px-5 py-3.5 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 font-semibold text-slate-800 placeholder-slate-400 text-xs sm:text-sm shadow-inner"
            />
            <div className="text-right mt-1.5 text-xs text-slate-400 font-semibold">
              {formData.title.length}/100
            </div>
          </div>

          {/* Content Description Input */}
          <div className="group">
            <label className="block mb-2 font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              Discussion Description
            </label>
            <textarea
              rows={6}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your question or share your technical knowledge..."
              className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 px-5 py-3.5 resize-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 font-semibold text-slate-800 placeholder-slate-400 text-xs sm:text-sm shadow-inner"
            />
            <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-semibold">
              <span>Markdown supported</span>
              <span>{formData.content.length} chars</span>
            </div>
          </div>

          {/* Tags Input */}
          <div className="group">
            <label className="flex items-center gap-2 mb-2 font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              <FaTags className="text-indigo-600 shrink-0" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, Node.js, System Design, Algorithms"
              className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 px-5 py-3.5 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 font-semibold text-slate-800 placeholder-slate-400 text-xs sm:text-sm shadow-inner"
            />
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
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
                      className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all duration-200 shadow-md shadow-purple-500/20 ${
                loading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 hover:scale-105 active:scale-95 cursor-pointer"
              }`}
            >
              <FaPaperPlane className="shrink-0" />
              <span>{loading ? "Creating..." : "Create Discussion"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionForm;