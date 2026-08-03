import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, AlignLeft, LayoutList, Target, Gift, Shield, CheckCircle, Save, Loader2, AlertCircle } from "lucide-react";

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
        description: initialData.description || "",
        category: initialData.category || "",
        target: initialData.target || "",
        rewardPoints: initialData.rewardPoints || 0,
        badge: initialData.badge?._id || "",
        isActive: initialData.isActive ?? true,
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
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      validationErrors.title = "Title is required.";
    }
    if (!formData.description.trim()) {
      validationErrors.description = "Description is required.";
    }
    if (!formData.category) {
      validationErrors.category = "Category is required.";
    }
    if (!formData.target || Number(formData.target) <= 0) {
      validationErrors.target = "Target must be greater than zero.";
    }
    if (Number(formData.rewardPoints) < 0) {
      validationErrors.rewardPoints = "Reward points cannot be negative.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
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
      rewardPoints: Number(formData.rewardPoints),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" /> Achievement Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Code Master, Problem Solver"
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.title ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-amber-500/50 focus:border-amber-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
          />
          {errors.title && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.title}
            </motion.p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <AlignLeft size={16} className="text-indigo-500" /> Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what the user must do to unlock this..."
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.description ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white resize-none`}
          />
          {errors.description && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.description}
            </motion.p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <LayoutList size={16} className="text-blue-500" /> Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.category ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white cursor-pointer`}
          >
            <option value="">Select Category</option>
            <option value="questions">Questions</option>
            <option value="coding">Coding</option>
            <option value="tests">Tests</option>
            <option value="contests">Contests</option>
            <option value="interviews">Interviews</option>
          </select>
          {errors.category && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.category}
            </motion.p>
          )}
        </div>

        {/* Target */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Target size={16} className="text-rose-500" /> Target Value
          </label>
          <input
            type="number"
            min="1"
            name="target"
            value={formData.target}
            onChange={handleChange}
            placeholder="e.g. 50"
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.target ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-rose-500/50 focus:border-rose-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
          />
          {errors.target && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.target}
            </motion.p>
          )}
        </div>

        {/* Reward Points */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Gift size={16} className="text-emerald-500" /> Reward Points
          </label>
          <input
            type="number"
            min="0"
            name="rewardPoints"
            value={formData.rewardPoints}
            onChange={handleChange}
            placeholder="100"
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.rewardPoints ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
          />
          {errors.rewardPoints && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.rewardPoints}
            </motion.p>
          )}
        </div>

        {/* Badge */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Shield size={16} className="text-purple-500" /> Linked Badge
          </label>
          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all dark:text-white cursor-pointer"
          >
            <option value="">No Badge Selected</option>
            {badges.map((badge) => (
              <option key={badge._id} value={badge._id}>
                {badge.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 p-5 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Achievement Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Inactive achievements will be hidden and not awarded to users.
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
            <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500 transition-colors shadow-inner"></div>
            <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-7"></div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Processing...</>
          ) : initialData?._id ? (
            <><CheckCircle size={20} /> Update Achievement</>
          ) : (
            <><Save size={20} /> Create Achievement</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AchievementForm;