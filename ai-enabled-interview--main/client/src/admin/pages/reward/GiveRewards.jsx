import { useNavigate } from "react-router-dom";

import RewardForm from "../../components/reward/RewardForm";

import useReward from "../../hooks/useReward";


const GiveReward = () => {


  const navigate =
    useNavigate();



  const {
    giveReward,
    loading
  } = useReward();





  const handleSubmit =
  async(formData)=>{


    const success =
      await giveReward(
        formData
      );



    if(success){

      navigate(
        "/admin/rewards"
      );

    }


  };





  return (

    <div
    className="
    p-6
    "
    >


      <div
      className="
      max-w-3xl
      mx-auto
      "
      >


        <div
        className="
        mb-6
        "
        >

          <h1
          className="
          text-2xl
          font-bold
          text-slate-900
          "
          >

            Give Reward

          </h1>



          <p
          className="
          text-sm
          text-slate-500
          mt-1
          "
          >

            Assign achievement rewards and badges to users

          </p>


        </div>





        <RewardForm

          onSubmit={
            handleSubmit
          }

          loading={
            loading
          }

        />



      </div>


    </div>

  );

};


export default GiveReward;