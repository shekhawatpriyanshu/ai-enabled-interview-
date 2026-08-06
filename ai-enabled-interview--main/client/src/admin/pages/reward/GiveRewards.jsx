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
    async (formData) => {


      const success =
        await giveReward(
          formData
        );



      if (success) {

        navigate(
          "/admin/rewards"
        );

      }


    };





  return (
    <div className="p-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-3xl mx-auto">
        <RewardForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );

};


export default GiveReward;