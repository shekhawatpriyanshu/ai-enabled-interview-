import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

import useAdminCommunity from "../../hooks/useAdminCommunity";

const EditGroup = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    loading,
    getGroupById,
    updateGroup,
  } = useAdminCommunity();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const res = await getGroupById(id);

      if (res?.success) {
        setFormData({
          name: res.group.name || "",
          description:
            res.group.description || "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load group");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Group name is required";
    }

    if (
      formData.description.length > 500
    ) {
      newErrors.description =
        "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await updateGroup(
      id,
      formData
    );

    if (res?.success) {
      toast.success(
        "Group updated successfully"
      );

      navigate(
        `/admin/community/group/${id}`
      );
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 mb-3"
          >
            <FaArrowLeft />
            Back
          </button>

          <h1 className="text-3xl font-bold">
            Edit Study Group
          </h1>

          <p className="text-gray-500 mt-2">
            Update group information.
          </p>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow border p-6 space-y-6"
      >

        {/* Group Name */}

        <div>

          <label className="block font-medium mb-2">
            Group Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Enter group name"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}

        </div>

        {/* Description */}

        <div>

          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Enter description"
          />

          <div className="flex justify-between mt-2">

            {errors.description ? (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            ) : (
              <span />
            )}

            <p className="text-sm text-gray-500">
              {formData.description.length}/500
            </p>

          </div>

        </div>
                {/* Action Buttons */}

        <div className="flex justify-end gap-4 pt-4 border-t">

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
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaSave />

            {loading
              ? "Updating..."
              : "Update Group"}
          </button>

        </div>

      </form>

      {/* Information Card */}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

        <h3 className="font-semibold text-blue-700 mb-3">
          Admin Notes
        </h3>

        <ul className="list-disc list-inside text-gray-700 space-y-2">

          <li>
            Updating a group does not remove any
            members.
          </li>

          <li>
            Existing chat messages remain
            unchanged.
          </li>

          <li>
            Only the group's name and
            description can be modified.
          </li>

        </ul>

      </div>

    </div>
  );
};

export default EditGroup;