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
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border p-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <Users size={24} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Create Study Group
          </h2>

          <p className="text-gray-500">
            Build a community and learn together.
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
        className="space-y-6"
      >
        {/* Group Name */}
        <div>
          <label className="block mb-2 font-medium">
            Group Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter study group name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your study group..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
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
            {loading
              ? "Creating..."
              : "Create Group"}
          </button>

        </div>
      </form>

    </div>
  );
};

export default GroupForm;