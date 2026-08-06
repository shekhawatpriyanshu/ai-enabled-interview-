import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrophy, FaPlus } from "react-icons/fa";

import useReward from "../../hooks/useReward";

import RewardTable from "../../components/reward/RewardTable";
import DeleteModal from "../../components/reward/DeleteModal";


const RewardList = () => {


  const navigate = useNavigate();


  const {

    rewards,

    loading,

    getRewards,

    deleteReward

  } = useReward();



  const [search,setSearch] =
    useState("");



  const [selectedReward,setSelectedReward] =
    useState(null);



  const [showDelete,setShowDelete] =
    useState(false);



  const [currentPage,setCurrentPage] =
    useState(1);



  const pageSize = 10;



  useEffect(()=>{

    getRewards();

  },[]);




  // ================================
  // Search Filter
  // ================================

  const filteredRewards =
    rewards.filter((reward)=>{


      const userName =
      reward.user?.name
      ?.toLowerCase()
      || "";


      const achievement =
      reward.achievement?.title
      ?.toLowerCase()
      || "";



      return (

        userName.includes(
          search.toLowerCase()
        )

        ||

        achievement.includes(
          search.toLowerCase()
        )

      );


    });





  // ================================
  // Pagination
  // ================================

  const start =
  (currentPage-1)
  *
  pageSize;



  const paginatedRewards =
  filteredRewards.slice(
    start,
    start+pageSize
  );




  const totalPages =
  Math.ceil(
    filteredRewards.length/pageSize
  );




  // ================================
  // Delete Handler
  // ================================

  const handleDelete =
  async()=>{


    const success =
    await deleteReward(
      selectedReward._id
    );


    if(success){

      setShowDelete(false);

      setSelectedReward(null);

    }


  };





  return (
    <div className="p-6 space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
            <FaTrophy className="text-amber-400 text-3xl sm:text-4xl drop-shadow-md hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              All Rewards
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5">
            Manage earned rewards, XP points, and badges across all users.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/rewards/give")}
          className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:via-rose-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-sm"
        >
          <FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
          Give Reward
        </button>
      </div>





      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Rewards
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user or achievement..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>






      {/* Table */}

      <RewardTable

      rewards={
        paginatedRewards
      }

      loading={
        loading
      }


      currentPage={
        currentPage
      }


      pageSize={
        pageSize
      }


      onView={(reward)=>
        navigate(
          `/admin/rewards/${reward._id}`
        )
      }


      onDelete={(reward)=>{

        setSelectedReward(
          reward
        );

        setShowDelete(
          true
        );

      }}

      />







      {/* Pagination */}

      {
        totalPages > 1 &&


        <div
        className="
        flex
        justify-center
        gap-3
        "
        >


        {
          Array.from(
            {
              length:totalPages
            }
          )
          .map((_,index)=>(


            <button

            key={index}

            onClick={()=>setCurrentPage(
              index+1
            )}

            className={`
            px-4
            py-2
            rounded-lg
            ${
              currentPage===index+1
              ?
              "bg-blue-600 text-white"
              :
              "bg-slate-100"
            }
            `}

            >

            {index+1}

            </button>


          ))
        }


        </div>

      }







      {/* Delete Modal */}

      {
        showDelete &&


        <DeleteModal

        reward={
          selectedReward
        }


        onClose={()=>{

          setShowDelete(false);

        }}


        onConfirm={
          handleDelete
        }

        />

      }



    </div>

  );

};


export default RewardList;