import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import AchievementForm from "../../../admin/components/achievement/AchievementForm";
import useAchievement from "../../../admin/hooks/useAchievement";

const EditAchievement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    loading,
    achievement,
    getAchievementById,
    updateAchievement,
  } = useAchievement();

  // ======================================
  // Load Achievement
  // ======================================
  useEffect(() => {
    if (id) {
      getAchievementById(id);
    }
  }, [id]);

  // ======================================
  // Submit
  // ======================================
  const handleSubmit = async (formData) => {
    const success = await updateAchievement(id, formData);
    if (success) {
      navigate("/admin/achievement");
    }
  };

  if (loading && !achievement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading achievement data...</p>
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/achievement")}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <Trophy className="text-amber-500" size={28} />
            Edit Achievement
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Update achievement requirements, rewards, category, and status.
          </p>
        </div>
      </div>

      {/* Form */}
      <AchievementForm
        initialData={achievement}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

export default EditAchievement;