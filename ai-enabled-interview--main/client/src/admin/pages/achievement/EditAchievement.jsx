import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const success = await updateAchievement(
      id,
      formData
    );

    if (success) {
      navigate("/admin/achievement");
    }
  };

  if (loading && !achievement) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Edit Achievement
        </h1>

        <p className="text-slate-500 mt-2">
          Update achievement information,
          rewards, category, and status.
        </p>
      </div>

      {/* Form */}

      <AchievementForm
        initialData={achievement}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditAchievement;