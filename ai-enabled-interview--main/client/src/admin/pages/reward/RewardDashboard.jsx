import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    <div className="p-6 space-y-8">


      {/* Header */}

      <div
        className="
        flex
        justify-between
        items-center
        "
      >

        <div>

          <h1
            className="
            text-2xl
            font-bold
            text-slate-900
            "
          >
            Reward Management
          </h1>


          <p
            className="
            text-sm
            text-slate-500
            mt-1
            "
          >
            Manage user rewards, badges and achievements
          </p>


        </div>



        <button

          onClick={()=>navigate(
            "/admin/rewards/give"
          )}

          className="
          px-5
          py-2.5
          rounded-xl
          bg-blue-600
          text-white
          font-semibold
          hover:bg-blue-700
          transition
          "
        >

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


        <div
          className="
          flex
          justify-between
          items-center
          mb-5
          "
        >


          <h2
            className="
            text-lg
            font-bold
            text-slate-800
            "
          >
            Recent Rewards
          </h2>



          <button

            onClick={()=>navigate(
              "/admin/rewards"
            )}

            className="
            text-sm
            text-blue-600
            font-semibold
            "
          >

            View All

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