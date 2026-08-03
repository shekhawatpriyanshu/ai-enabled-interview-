import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, AlignLeft, Info, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading study group data...</p>
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
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="text-blue-500" size={28} />
            Edit Study Group
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Update community group information and guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.name ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
                  placeholder="e.g. Data Structures & Algorithms Prep"
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <AlignLeft size={16} className="text-indigo-500" /> Description
                </label>
                <textarea
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.description ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white resize-none`}
                  placeholder="Describe the purpose of this study group..."
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  {errors.description ? (
                    <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description}
                    </motion.p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-xs font-medium ${formData.description.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.description.length}/500
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Updating...</>
                  ) : (
                    <><Save size={20} /> Update Group</>
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
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-bl-full" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg text-blue-600 dark:text-blue-400">
                <Info size={24} />
              </div>
              <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                Admin Notes
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  Updating a group does <strong className="font-semibold">not</strong> remove any current members from the group.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  All existing chat messages and discussion history remain unchanged.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  Only the group's display name and internal description can be modified here.
                </p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditGroup;