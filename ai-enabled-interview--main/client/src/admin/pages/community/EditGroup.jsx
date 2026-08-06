import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, AlignLeft, Info, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import useAdminCommunity from "../../hooks/useAdminCommunity";

const EditGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, getGroupById, updateGroup } = useAdminCommunity();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      setInitialLoading(true);
      const res = await getGroupById(id);

      if (res?.success) {
        setFormData({
          name: res.group.name || "",
          description: res.group.description || "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load group");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await updateGroup(id, formData);

    if (res?.success) {
      toast.success("Group updated successfully");
      navigate(`/admin/community/group/${id}`);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
        <p className="text-slate-500 font-extrabold text-xs tracking-wider uppercase animate-pulse">
          Loading Study Group Information...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Header section */}
      <div className="flex items-center gap-4 border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-200 transition-all text-slate-500 hover:text-purple-600 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 animate-bounce">
              <Users size={24} />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Edit Study Group
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Update community study group information and guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-indigo-600" /> Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${
                    errors.name ? "border-rose-400 focus:ring-rose-500/50" : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-500"
                  } rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all font-semibold text-slate-800 text-sm`}
                  placeholder="e.g. Data Structures & Algorithms Prep"
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <AlignLeft size={16} className="text-purple-600" /> Description
                </label>
                <textarea
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${
                    errors.description ? "border-rose-400 focus:ring-rose-500/50" : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-500"
                  } rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all font-medium text-slate-800 text-sm resize-none`}
                  placeholder="Describe the purpose of this study group..."
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  {errors.description ? (
                    <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-rose-500 text-xs font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description}
                    </motion.p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-xs font-bold ${formData.description.length > 500 ? "text-rose-500" : "text-slate-400"}`}>
                    {formData.description.length}/500
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-extrabold text-slate-600 transition-all hover:bg-slate-100 text-xs active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 px-8 py-2.5 font-black text-white shadow-lg shadow-indigo-500/25 transition-all text-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={16} /> Updating...</>
                  ) : (
                    <><Save size={16} /> Update Group</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Info size={20} />
              </div>
              <h3 className="font-black text-indigo-950 text-base">
                Admin Notes
              </h3>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-indigo-900 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                Updating a group does not remove any current members.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                All existing chat messages and history remain preserved.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                Only group display name and description are modified.
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditGroup;