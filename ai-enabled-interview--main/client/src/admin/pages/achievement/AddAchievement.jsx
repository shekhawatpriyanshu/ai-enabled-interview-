import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft } from "lucide-react";

import AchievementForm from "../../../admin/components/achievement/AchievementForm";
import useAchievement from "../../../admin/hooks/useAchievement";

const AddAchievement = () => {
  const navigate = useNavigate();

  const { loading, createAchievement } = useAchievement();

  const handleSubmit = async (formData) => {
    const success = await createAchievement(formData);
    if (success) {
      navigate("/admin/achievement");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate("/admin/achievement")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-600 mb-3 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Achievements
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-bounce">
              <Trophy />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Create Achievement
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Configure automated milestone achievements and points rewards for platform users.
          </p>
        </div>
      </div>

      {/* Achievement Form */}
      <AchievementForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddAchievement;
