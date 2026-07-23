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

    <div className="p-6 space-y-6">



      {/* Header */}

      <div
      className="
      flex
      justify-between
      items-center
      "
      >


        <button

        onClick={()=>
          navigate(
            "/admin/rewards"
          )
        }

        className="
        flex
        items-center
        gap-2
        text-slate-600
        "
        >

          <FaArrowLeft/>

          Back

        </button>



        <button

        onClick={handleDelete}

        className="
        flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        bg-red-600
        text-white
        "
        >

          <FaTrash/>

          Delete Reward

        </button>


      </div>






      {/* Reward Card */}

      <div
      className="
      bg-white
      border
      rounded-2xl
      shadow-sm
      p-6
      "
      >


        <h1
        className="
        text-2xl
        font-bold
        text-slate-900
        mb-6
        "
        >

          Reward Details

        </h1>




        <div
        className="
        grid
        md:grid-cols-2
        gap-6
        "
        >



          {/* User */}

          <InfoCard

          icon={<FaUser/>}

          title="User"

          value={
            reward.user?.name
          }

          extra={
            reward.user?.email
          }

          />





          {/* Achievement */}

          <InfoCard

          icon={<FaTrophy/>}

          title="Achievement"

          value={
            reward.achievement?.title
          }

          extra={
            reward.achievement?.category
          }

          />





          {/* Badge */}

          <InfoCard

          icon={<FaAward/>}

          title="Badge"

          value={
            reward.badge?.title
          }

          extra={
            reward.badge?.description
          }

          />






          {/* Points */}

          <InfoCard

          icon={<FaCoins/>}

          title="Reward Points"

          value={
            `${reward.rewardPoints || 0} XP`
          }

          />






          {/* Date */}

          <InfoCard

          icon={<FaCalendarAlt/>}

          title="Earned At"

          value={
            new Date(
              reward.earnedAt
            )
            .toLocaleDateString()
          }

          />



        </div>



      </div>



    </div>

  );

};





const InfoCard = ({
  icon,
  title,
  value,
  extra
})=>{


return (

<div
className="
flex
gap-4
p-5
rounded-xl
bg-slate-50
border
"
>


<div
className="
text-blue-600
text-xl
"
>

{icon}

</div>



<div>

<p
className="
text-sm
text-slate-500
"
>

{title}

</p>


<h3
className="
font-semibold
text-slate-900
"
>

{value || "N/A"}

</h3>



{
extra &&

<p
className="
text-xs
text-slate-500
mt-1
"
>

{extra}

</p>

}



</div>


</div>

);


};




export default RewardDetails;