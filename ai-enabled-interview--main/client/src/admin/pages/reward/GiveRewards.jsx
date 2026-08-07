import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RewardForm from "../../components/reward/RewardForm";
import useReward from "../../hooks/useReward";

const GiveReward = () => {
  const navigate = useNavigate();

  const { giveReward, loading } = useReward();

  const handleSubmit = async (formData) => {
    const success = await giveReward(formData);
    if (success) {
      navigate("/admin/rewards");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Navigation Button */}
        <div>
          <button
            onClick={() => navigate("/admin/rewards")}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-x-1 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-indigo-500" />
            <span>Back to Rewards</span>
          </button>
        </div>

        <RewardForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default GiveReward;