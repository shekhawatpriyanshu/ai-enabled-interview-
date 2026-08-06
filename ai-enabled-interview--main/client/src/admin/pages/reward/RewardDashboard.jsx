import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaGift, FaPlus, FaArrowRight } from "react-icons/fa";
import useReward from "../../hooks/useReward";

import DashboardCards from "../../components/reward/DashboardCards";

import RewardCard from "../../components/reward/RewardCard";


const RewardDashboard = () => {


  const navigate = useNavigate();


  const {
    dashboard,
    loading,
    getDashboard
  } = useReward();



  useEffect(()=>{

    getDashboard();

  },[]);



  if(loading){

    return (

      <div className="flex justify-center items-center py-20">

        <div
          className="
          h-10
          w-10
          rounded-full
          border-4
          border-blue-500/30
          border-t-blue-600
          animate-spin
          "
        />

      </div>

    );

  }




  return (
    <div className="p-6 space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
            <FaGift className="text-amber-400 text-3xl sm:text-4xl drop-shadow-md hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Reward Management
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5">
            Manage user rewards, badges, and achievements across the platform
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/rewards/give")}
          className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:via-rose-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-sm self-start sm:self-auto"
        >
          <FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
          Give Reward
        </button>
      </div>




      {/* Statistics */}

      {
        dashboard &&

        <DashboardCards
          dashboard={dashboard}
        />

      }





      {/* Recent Rewards */}

      <div
        className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-6
        "
      >


        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Recent Rewards
          </h2>

          <button
            onClick={() => navigate("/admin/rewards")}
            className="group flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all cursor-pointer"
          >
            View All
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>





        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-5
          "
        >


        {
          dashboard?.recentRewards
          ?.map((item)=>(


            <RewardCard

              key={item._id}

              reward={item}

            />


          ))
        }


        </div>



      </div>


    </div>

  );

};


export default RewardDashboard;