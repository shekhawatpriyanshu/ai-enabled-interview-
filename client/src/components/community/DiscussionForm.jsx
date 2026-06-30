import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    if (!formData.title.trim()) {
      return setError("Title is required.");
    }

    if (!formData.content.trim()) {
      return setError("Content is required.");
    }

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await createNewDiscussion(payload);

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
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Create Discussion
      </h2>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block font-medium mb-2">
            Discussion Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter discussion title..."
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            rows={8}
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your discussion..."
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-2">
            Tags
          </label>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="React, JavaScript, Interview, DSA"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <p className="text-sm text-gray-500 mt-2">
            Separate multiple tags using commas.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Discussion"}
          </button>

        </div>
      </form>

    </div>
  );
};

export default DiscussionForm;