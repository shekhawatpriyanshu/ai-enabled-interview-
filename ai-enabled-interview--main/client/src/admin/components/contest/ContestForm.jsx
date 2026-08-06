import { useEffect, useState } from "react";
import {
  FaTrophy,
  FaAlignLeft,
  FaCalendarAlt,
  FaClock,
  FaFlag,
  FaSave,
  FaCode,
} from "react-icons/fa";
import ProblemSelector from "./ProblemSelector";

const ContestForm = ({ initialData = {}, loading = false, onSubmit }) => {
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
        status: initialData.status || "Upcoming",
        problems:
          initialData.problems?.map((item) =>
            typeof item === "object" ? item._id : item
          ) || [],
      });
    }
  }, [initialData]);

  const formatDateTime = (value) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

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
      validationErrors.title = "Contest title is required.";
    }

    if (!formData.description.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (!formData.startTime) {
      validationErrors.startTime = "Start time is required.";
    }

    if (!formData.endTime) {
      validationErrors.endTime = "End time is required.";
    }

    if (!formData.duration) {
      validationErrors.duration = "Duration is required.";
    }

    if (formData.problems.length === 0) {
      validationErrors.problems = "Select at least one problem.";
    }

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        validationErrors.endTime = "End time must be after start time.";
      }
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. CONTEST INFORMATION CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaTrophy className="text-amber-500" /> Contest Basic Info
        </h2>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaTrophy className="text-amber-500 text-xs" /> Contest Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Weekly Algorithmic Showdown #42"
            className={`w-full bg-slate-50 border ${
              errors.title
                ? "border-rose-400 focus:ring-rose-500/50"
                : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-500"
            } rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all font-semibold text-slate-800 text-sm`}
          />
          {errors.title && (
            <p className="text-rose-500 text-xs font-bold mt-1">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaAlignLeft className="text-purple-500 text-xs" /> Description & Guidelines
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter rules, prizes, and overview of the contest..."
            className={`w-full bg-slate-50 border ${
              errors.description
                ? "border-rose-400 focus:ring-rose-500/50"
                : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-500"
            } rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all font-medium text-slate-800 text-sm resize-none`}
          />
          {errors.description && (
            <p className="text-rose-500 text-xs font-bold mt-1">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. SCHEDULE CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaCalendarAlt className="text-indigo-600" /> Schedule & Timing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500 text-xs" /> Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-full bg-slate-50 border ${
                errors.startTime
                  ? "border-rose-400 focus:ring-rose-500/50"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              } rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all font-semibold text-slate-800 text-sm cursor-pointer`}
            />
            {errors.startTime && (
              <p className="text-rose-500 text-xs font-bold mt-1">
                {errors.startTime}
              </p>
            )}
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FaCalendarAlt className="text-cyan-500 text-xs" /> End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`w-full bg-slate-50 border ${
                errors.endTime
                  ? "border-rose-400 focus:ring-rose-500/50"
                  : "border-slate-200 focus:ring-cyan-500/20 focus:border-cyan-500"
              } rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all font-semibold text-slate-800 text-sm cursor-pointer`}
            />
            {errors.endTime && (
              <p className="text-rose-500 text-xs font-bold mt-1">
                {errors.endTime}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FaClock className="text-amber-500 text-xs" /> Duration (Minutes)
            </label>
            <input
              type="number"
              min={1}
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 120"
              className={`w-full bg-slate-50 border ${
                errors.duration
                  ? "border-rose-400 focus:ring-rose-500/50"
                  : "border-slate-200 focus:ring-amber-500/20 focus:border-amber-500"
              } rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all font-semibold text-slate-800 text-sm`}
            />
            {errors.duration && (
              <p className="text-rose-500 text-xs font-bold mt-1">
                {errors.duration}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FaFlag className="text-emerald-500 text-xs" /> Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-normal text-slate-800 text-sm cursor-pointer"
            >
              <option value="Upcoming" className="bg-white font-normal text-slate-800 py-1">
                ⏳ Upcoming Contest
              </option>
              <option value="Live" className="bg-white font-normal text-slate-800 py-1">
                🔥 Live Contest
              </option>
              <option value="Completed" className="bg-white font-normal text-slate-800 py-1">
                ✅ Completed Contest
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PROBLEMS SELECTION CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaCode className="text-teal-600" /> Contest Coding Challenges
        </h2>

        <ProblemSelector
          selectedProblems={formData.problems}
          onChange={(problems) =>
            setFormData((prev) => ({
              ...prev,
              problems,
            }))
          }
        />

        {errors.problems && (
          <p className="text-rose-500 text-xs font-bold mt-2">
            {errors.problems}
          </p>
        )}
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-600 transition-all hover:bg-slate-100 text-xs active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FaSave className="text-xs" />
              {initialData?._id ? "Update Contest" : "Create Contest"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContestForm;