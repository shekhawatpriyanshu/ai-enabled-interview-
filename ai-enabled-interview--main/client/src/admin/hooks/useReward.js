import { useState } from "react";
import toast from "react-hot-toast";

import RewardService from "../services/RewardService";


const useReward = () => {


  const [loading, setLoading] =
    useState(false);


  const [rewards, setRewards] =
    useState([]);


  const [reward, setReward] =
    useState(null);


  const [dashboard, setDashboard] =
    useState(null);



  // =====================================
  // GET DASHBOARD
  // =====================================

  const getDashboard =
    async () => {

      try {

        setLoading(true);


        const data =
          await RewardService.getDashboard();


        setDashboard(
          data.dashboard
        );


      }
      catch(error){

        toast.error(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );

      }
      finally{

        setLoading(false);

      }

    };




  // =====================================
  // GET ALL REWARDS
  // =====================================

  const getRewards =
    async()=>{

      try{

        setLoading(true);


        const data =
          await RewardService.getRewards();


        setRewards(
          data.rewards || []
        );


      }
      catch(error){

        toast.error(
          error.response?.data?.message ||
          "Failed to load rewards"
        );

      }
      finally{

        setLoading(false);

      }

    };




  // =====================================
  // GET SINGLE REWARD
  // =====================================

  const getRewardById =
    async(id)=>{

      try{

        setLoading(true);


        const data =
          await RewardService.getRewardById(
            id
          );


        setReward(
          data.reward
        );


      }
      catch(error){

        toast.error(
          error.response?.data?.message ||
          "Failed to load reward"
        );

      }
      finally{

        setLoading(false);

      }

    };




  // =====================================
  // GIVE REWARD
  // =====================================

  const giveReward =
    async(formData)=>{


      try{

        setLoading(true);


        const data =
          await RewardService.giveReward(
            formData
          );


        toast.success(
          "Reward assigned successfully"
        );


        return true;


      }
      catch(error){

        toast.error(
          error.response?.data?.message ||
          "Failed to give reward"
        );


        return false;

      }
      finally{

        setLoading(false);

      }

    };




  // =====================================
  // DELETE REWARD
  // =====================================

  const deleteReward =
    async(id)=>{


      try{

        setLoading(true);


        await RewardService.deleteReward(
          id
        );


        setRewards(
          prev =>
          prev.filter(
            item =>
            item._id !== id
          )
        );


        toast.success(
          "Reward deleted"
        );


        return true;


      }
      catch(error){

        toast.error(
          error.response?.data?.message ||
          "Delete failed"
        );


        return false;

      }
      finally{

        setLoading(false);

      }

    };



  return {


    loading,


    rewards,

    reward,

    dashboard,


    getDashboard,

    getRewards,

    getRewardById,

    giveReward,

    deleteReward,


  };


};


export default useReward;