// src/components/analytics/EmptyRewards.jsx

import { FaGift, FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmptyRewards = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-sm">
      
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-4xl text-amber-500 shadow-inner">
        <FaGift />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-slate-800 mb-3">
        No Rewards Yet
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
        Keep solving questions, completing coding challenges,
        participating in contests, and taking interviews to unlock
        exciting achievements and badges.
      </p>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-center gap-2.5 max-w-md mx-auto mt-6 text-blue-700 text-sm">
        <FaRocket className="text-blue-500" />
        <span className="font-medium">
          Complete your first activity to start earning rewards!
        </span>
      </div>

      {/* Button */}
      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition duration-300"
        onClick={() => navigate("/interviews/start")}
      >
        Start Learning
      </button>

    </div>
  );
};

export default EmptyRewards;