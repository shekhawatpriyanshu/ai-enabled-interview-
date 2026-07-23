import { useEffect, useState } from "react";

import useAchievement from "../../../admin/hooks/useAchievement";

const AchievementForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const { getBadges } = useAchievement();

  const [badges, setBadges] = useState([]);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    category: "",

    target: "",

    rewardPoints: 0,

    badge: "",

    isActive: true,
  });

  // ================================
  // Load Existing Data
  // ================================

  useEffect(() => {
    if (initialData?._id) {
      setFormData({
        title: initialData.title || "",

        description:
          initialData.description || "",

        category:
          initialData.category || "",

        target:
          initialData.target || "",

        rewardPoints:
          initialData.rewardPoints || 0,

        badge:
          initialData.badge?._id || "",

        isActive:
          initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  // ================================
  // Load Badges
  // ================================

  useEffect(() => {
    const loadBadges = async () => {
      const data = await getBadges();

      setBadges(data);
    };

    loadBadges();
  }, []);

  // ================================
  // Handle Change
  // ================================

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,

        [name]: "",
      }));
    }
  };

  // ================================
  // Validation
  // ================================

  const validate = () => {
    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title =
        "Title is required.";
    }

    if (
      !formData.description.trim()
    ) {
      validationErrors.description =
        "Description is required.";
    }

    if (!formData.category) {
      validationErrors.category =
        "Category is required.";
    }

    if (
      !formData.target ||
      Number(formData.target) <= 0
    ) {
      validationErrors.target =
        "Target must be greater than zero.";
    }

    if (
      Number(formData.rewardPoints) < 0
    ) {
      validationErrors.rewardPoints =
        "Reward points cannot be negative.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors)
        .length === 0
    );
  };

  // ================================
  // Submit
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      ...formData,

      target: Number(formData.target),

      rewardPoints: Number(
        formData.rewardPoints
      ),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6"
    >
      {/* ===================================
              Title
      ==================================== */}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Achievement Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter achievement title"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
            errors.title
              ? "border-red-500"
              : "border-slate-300 focus:border-blue-500"
          }`}
        />

        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* ===================================
              Description
      ==================================== */}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Achievement description..."
          className={`w-full rounded-xl border px-4 py-3 outline-none resize-none transition ${
            errors.description
              ? "border-red-500"
              : "border-slate-300 focus:border-blue-500"
          }`}
        />

        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description}
          </p>
        )}
      </div>
            {/* ===================================
              Category & Target
      ==================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.category
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          >
            <option value="">Select Category</option>

            <option value="questions">
              Questions
            </option>

            <option value="coding">
              Coding
            </option>

            <option value="tests">
              Tests
            </option>

            <option value="contests">
              Contests
            </option>

            <option value="interviews">
              Interviews
            </option>
          </select>

          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category}
            </p>
          )}
        </div>

        {/* Target */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target
          </label>

          <input
            type="number"
            min="1"
            name="target"
            value={formData.target}
            onChange={handleChange}
            placeholder="e.g. 50"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.target
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.target && (
            <p className="mt-1 text-sm text-red-500">
              {errors.target}
            </p>
          )}
        </div>
      </div>

      {/* ===================================
              Reward Points & Badge
      ==================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reward Points */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Reward Points
          </label>

          <input
            type="number"
            min="0"
            name="rewardPoints"
            value={formData.rewardPoints}
            onChange={handleChange}
            placeholder="100"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.rewardPoints
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }`}
          />

          {errors.rewardPoints && (
            <p className="mt-1 text-sm text-red-500">
              {errors.rewardPoints}
            </p>
          )}
        </div>

        {/* Badge */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Badge
          </label>

          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">
              No Badge
            </option>

            {badges.map((badge) => (
              <option
                key={badge._id}
                value={badge._id}
              >
                {badge.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===================================
              Status
      ==================================== */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">
              Achievement Status
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Inactive achievements will not
              be awarded to users.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>

            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>
            {/* ===================================
              Actions
      ==================================== */}

      <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="min-w-[180px] px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
                />
              </svg>

              Saving...
            </>
          ) : (
            <>
              {initialData?._id
                ? "Update Achievement"
                : "Create Achievement"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AchievementForm;