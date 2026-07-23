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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">

                <FaComments size={28} />

              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Start a Discussion
                </h1>

                <p className="text-blue-100 mt-2">
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

            <div>

              <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">

                <FaHeading className="text-blue-600" />
                Discussion Title

              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Best way to prepare for DSA interviews?"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400"
              />

              <div className="text-right mt-2 text-sm text-gray-400">
                {formData.title.length}/100
              </div>

            </div>

            {/* Content */}

            <div>

              <label className="block mb-3 font-semibold text-gray-700">
                Discussion Description
              </label>

              <textarea
                rows={8}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe your question or share your knowledge..."
                className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all duration-300 resize-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400"
              />

              <div className="flex justify-between mt-2">

                <span className="text-gray-400 text-sm">
                  Markdown supported (if enabled)
                </span>

                <span className="text-gray-400 text-sm">
                  {formData.content.length} characters
                </span>

              </div>

            </div>

            {/* Tags */}

            <div>

              <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">

                <FaTags className="text-green-600" />
                Tags

              </label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, DSA"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 transition-all duration-300 focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none hover:border-green-400"
              />

              <p className="text-sm text-gray-500 mt-3">
                Separate tags using commas.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {formData.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}

              </div>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4 pt-6 border-t">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all duration-300"
              >
                <FaArrowLeft />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-xl"
                }`}
              >
                <FaPaperPlane />

                {loading
                  ? "Creating..."
                  : "Create Discussion"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default DiscussionForm;