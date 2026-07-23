import { useEffect, useState } from "react";

import ProblemSelector from "./ProblemSelector";

const ContestForm = ({
  initialData = {},
  loading = false,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: "",
    status: "Upcoming",
    problems: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",

        startTime: initialData.startTime
          ? formatDateTime(initialData.startTime)
          : "",

        endTime: initialData.endTime
          ? formatDateTime(initialData.endTime)
          : "",

        duration: initialData.duration || "",

        status:
          initialData.status || "Upcoming",

        problems:
          initialData.problems?.map((item) =>
            typeof item === "object"
              ? item._id
              : item
          ) || [],
      });
    }
  }, [initialData]);

  const formatDateTime = (value) => {
    const date = new Date(value);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title =
        "Contest title is required.";
    }

    if (!formData.description.trim()) {
      validationErrors.description =
        "Description is required.";
    }

    if (!formData.startTime) {
      validationErrors.startTime =
        "Start time is required.";
    }

    if (!formData.endTime) {
      validationErrors.endTime =
        "End time is required.";
    }

    if (!formData.duration) {
      validationErrors.duration =
        "Duration is required.";
    }

    if (formData.problems.length === 0) {
      validationErrors.problems =
        "Select at least one problem.";
    }

    if (
      formData.startTime &&
      formData.endTime
    ) {
      if (
        new Date(formData.endTime) <=
        new Date(formData.startTime)
      ) {
        validationErrors.endTime =
          "End time must be after start time.";
      }
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors)
        .length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };
    return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ========================= */}
      {/* Contest Information */}
      {/* ========================= */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Contest Information
        </h2>

        {/* Title */}

        <div className="mb-5">

          <label className="block mb-2 font-medium">
            Contest Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter contest title"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500">
              {errors.title}
            </p>
          )}

        </div>

        {/* Description */}

        <div>

          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter contest description"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description}
            </p>
          )}

        </div>

      </div>

      {/* ========================= */}
      {/* Schedule */}
      {/* ========================= */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Contest Schedule
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Start Time */}

          <div>

            <label className="block mb-2 font-medium">
              Start Time
            </label>

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startTime}
              </p>
            )}

          </div>

          {/* End Time */}

          <div>

            <label className="block mb-2 font-medium">
              End Time
            </label>

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endTime}
              </p>
            )}

          </div>

          {/* Duration */}

          <div>

            <label className="block mb-2 font-medium">
              Duration (Minutes)
            </label>

            <input
              type="number"
              min={1}
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration}
              </p>
            )}

          </div>

          {/* Status */}

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Live">
                Live
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* Problems */}
      {/* ========================= */}

      <div className="bg-white rounded-lg shadow p-6">

        <ProblemSelector
          selectedProblems={
            formData.problems
          }
          onChange={(problems) =>
            setFormData((prev) => ({
              ...prev,
              problems,
            }))
          }
        />

        {errors.problems && (
          <p className="text-red-500 text-sm mt-3">
            {errors.problems}
          </p>
        )}

      </div>

      {/* ========================= */}
      {/* Buttons */}
      {/* ========================= */}

      <div className="flex justify-end gap-4">

        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
          className="px-6 py-3 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData?._id
            ? "Update Contest"
            : "Create Contest"}
        </button>

      </div>

    </form>
  );
};

export default ContestForm;