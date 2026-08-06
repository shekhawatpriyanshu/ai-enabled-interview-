import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaTrophy,
  FaAward,
  FaCoins,
  FaCalendarAlt,
  FaTrash,
} from "react-icons/fa";

import useReward from "../../hooks/useReward";


const RewardDetails = () => {


  const {
    id
  } = useParams();


  const navigate =
    useNavigate();



  const {

    reward,

    loading,

    getRewardById,

    deleteReward

  } = useReward();





  useEffect(()=>{

    getRewardById(id);

  },[id]);





  const handleDelete =
  async()=>{


    const success =
    await deleteReward(id);



    if(success){

      navigate(
        "/admin/rewards"
      );

    }


  };





  if(loading || !reward){

    return (

      <div
      className="
      flex
      justify-center
      items-center
      py-20
      "
      >

        <div
        className="
        h-10
        w-10
        border-4
        border-blue-500/30
        border-t-blue-600
        rounded-full
        animate-spin
        "
        />

      </div>

    );

  }





  return (
    <div className="p-6 space-y-6 animate-[fadeIn_0.5s_ease-out] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/admin/rewards")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <FaArrowLeft className="text-xs" />
          Back to Rewards
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-rose-600/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <FaTrash className="text-xs" />
          Delete Reward
        </button>
      </div>






      {/* Reward Card */}
      <div className="backdrop-blur-xl bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FaTrophy className="text-amber-400 text-3xl drop-shadow-sm hover:scale-110 transition-transform duration-200" />
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Reward Details
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Complete details and metadata of assigned reward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User */}
          <InfoCard
            icon={<FaUser />}
            iconBg="bg-blue-100 text-blue-600 border-blue-200"
            title="User"
            value={reward.user?.name}
            extra={reward.user?.email}
          />

          {/* Achievement */}
          <InfoCard
            icon={<FaTrophy />}
            iconBg="bg-amber-100 text-amber-600 border-amber-200"
            title="Achievement"
            value={reward.achievement?.title}
            extra={reward.achievement?.category}
          />

          {/* Badge */}
          <InfoCard
            icon={<FaAward />}
            iconBg="bg-purple-100 text-purple-600 border-purple-200"
            title="Badge"
            value={reward.badge?.title}
            extra={reward.badge?.description}
          />

          {/* Points */}
          <InfoCard
            icon={<FaCoins />}
            iconBg="bg-emerald-100 text-emerald-600 border-emerald-200"
            title="Reward Points"
            value={`${reward.rewardPoints || 0} XP`}
          />

          {/* Date */}
          <InfoCard
            icon={<FaCalendarAlt />}
            iconBg="bg-indigo-100 text-indigo-600 border-indigo-200"
            title="Earned At"
            value={new Date(reward.createdAt || reward.earnedAt).toLocaleString()}
          />
        </div>
      </div>



    </div>

  );

};





const InfoCard = ({ icon, iconBg, title, value, extra }) => {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border shrink-0 ${iconBg || "bg-blue-100 text-blue-600 border-blue-200"}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="font-bold text-slate-800 text-base mt-0.5 truncate">{value || "N/A"}</h3>
        {extra && <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{extra}</p>}
      </div>
    </div>
  );
};

export default RewardDetails;