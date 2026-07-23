import { useNavigate } from "react-router-dom";

import AchievementForm from "../../../admin/components/achievement/AchievementForm";
import useAchievement from "../../../admin/hooks/useAchievement";

const AddAchievement = () => {
  const navigate = useNavigate();

  const {
    loading,
    createAchievement,
  } = useAchievement();

  // ======================================
  // Submit
  // ======================================

  const handleSubmit = async (
    formData
  ) => {
    const success =
      await createAchievement(formData);

    if (success) {
      navigate("/admin/achievement");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Create Achievement
        </h1>

        <p className="text-slate-500 mt-2">
          Create a new achievement that users
          can unlock automatically after
          meeting the required target.
        </p>
      </div>

      {/* Form */}

      <AchievementForm
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddAchievement;
