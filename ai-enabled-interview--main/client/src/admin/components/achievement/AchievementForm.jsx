import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  AlignLeft,
  LayoutList,
  Target,
  Gift,
  Shield,
  CheckCircle,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  Award,
} from "lucide-react";

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

  // Find linked badge object
  const selectedBadgeObj = badges.find((b) => b._id === formData.badge);

  return (
    <div className="space-y-8">
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl"
      >
        {/* Multi-Color Gradient Top Border Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <Trophy size={16} />
              </div>
              Achievement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Code Master 100, Problem Solving Guru"
              className={`w-full bg-slate-50 border ${errors.title
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
                } rounded-2xl px-4 py-3.5 outline-none font-semibold text-slate-900 text-sm transition-all shadow-sm`}
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {errors.title}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                <AlignLeft size={16} />
              </div>
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe how users unlock this milestone..."
              className={`w-full bg-slate-50 border ${errors.description
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                } rounded-2xl px-4 py-3.5 outline-none font-medium text-slate-900 text-sm transition-all resize-none shadow-sm`}
            />
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {errors.description}
              </motion.p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                <LayoutList size={16} />
              </div>
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full bg-white text-slate-800 font-medium border ${errors.category
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                } rounded-2xl px-4 py-3.5 outline-none text-sm transition-all cursor-pointer shadow-sm`}
            >
              <option value="" className="text-slate-400 font-normal bg-white">Select Category...</option>
              <option value="questions" className="text-slate-700 font-normal bg-white py-2">🎯 Questions Solved</option>
              <option value="coding" className="text-slate-700 font-normal bg-white py-2">💻 Coding Challenges</option>
              <option value="tests" className="text-slate-700 font-normal bg-white py-2">📝 Mock Tests Completed</option>
              <option value="contests" className="text-slate-700 font-normal bg-white py-2">🏆 Contests Participated</option>
              <option value="interviews" className="text-slate-700 font-normal bg-white py-2">👔 AI Interviews Cleared</option>
            </select>
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {errors.category}
              </motion.p>
            )}
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <Target size={16} />
              </div>
              Target Value <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g. 50"
              className={`w-full bg-slate-50 border ${errors.target
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                } rounded-2xl px-4 py-3.5 outline-none font-extrabold text-slate-900 text-sm transition-all shadow-sm`}
            />
            {errors.target && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {errors.target}
              </motion.p>
            )}
          </div>

          {/* Reward Points */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <Gift size={16} />
              </div>
              Reward Points
            </label>
            <input
              type="number"
              min="0"
              name="rewardPoints"
              value={formData.rewardPoints}
              onChange={handleChange}
              placeholder="e.g. 100"
              className={`w-full bg-slate-50 border ${errors.rewardPoints
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                } rounded-2xl px-4 py-3.5 outline-none font-extrabold text-slate-900 text-sm transition-all shadow-sm`}
            />
            {errors.rewardPoints && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {errors.rewardPoints}
              </motion.p>
            )}
          </div>

          {/* Linked Badge */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                <Shield size={16} />
              </div>
              Linked Badge (Optional)
            </label>
            <select
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3.5 outline-none font-medium text-slate-800 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 transition-all cursor-pointer shadow-sm"
            >
              <option value="" className="text-slate-400 font-normal bg-white">No Badge Selected</option>
              {badges.map((badge) => (
                <option key={badge._id} value={badge._id} className="text-slate-700 font-normal bg-white py-2">
                  🏅 {badge.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Toggle Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Achievement Status
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Inactive achievements will be hidden from users and cannot be unlocked.
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
              <div className="w-14 h-7 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:via-rose-500 peer-checked:to-purple-600 transition-all duration-300 shadow-inner"></div>
              <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 peer-checked:translate-x-7"></div>
            </label>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 transition text-xs cursor-pointer active:scale-95"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Processing...
              </>
            ) : initialData?._id ? (
              <>
                <CheckCircle size={16} /> Update Achievement
              </>
            ) : (
              <>
                <Save size={16} /> Add Achievement
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AchievementForm;