import { useEffect, useState } from "react";

import {
  FaUser,
  FaTrophy,
  FaAward,
  FaCoins,
} from "react-icons/fa";


import useAchievement from "../../../admin/hooks/useAchievement";
import useBadge from "../../../admin/hooks/useBadge";
import { getUsers } from "../../services/userService";



const RewardForm = ({
  onSubmit,
  loading = false,
}) => {


  const {
    achievements,
    getAchievements,
  } = useAchievement();

  const {
    badges,
    getBadges,
  } = useBadge();

  const [usersList, setUsersList] = useState([]);



  const [formData,setFormData] =
  useState({

    userEmail:"",

    achievementId:"",

    badgeName:"",

    rewardPoints:""

  });





  useEffect(()=>{

    getAchievements();
    getBadges();

    const fetchUsers = async () => {
      try {
        const res = await getUsers({ limit: 1000 });
        if (res && res.users) {
          setUsersList(res.users);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();

  },[]);







  const handleChange=(e)=>{


    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });


  };






  const handleSubmit=(e)=>{

    e.preventDefault();


    onSubmit(formData);


  };








  return (

    <form

    onSubmit={handleSubmit}

    className="
    bg-white
    rounded-2xl
    border
    p-6
    space-y-6
    "
    >




      <h2
      className="
      text-xl
      font-bold
      text-slate-900
      "
      >

        Give Reward

      </h2>








      {/* Reward Points */}

      <div>


        <label
        className="
        text-sm
        font-semibold
        "
        >

          Reward Points

        </label>



        <div
        className="
        flex
        items-center
        gap-3
        border
        rounded-xl
        px-4
        mt-2
        "
        >

          <FaCoins
          className="
          text-green-600
          "
          />


          <input


          type="number"


          name="rewardPoints"


          value={
            formData.rewardPoints
          }


          onChange={
            handleChange
          }



          placeholder="
          Enter XP points
          "



          className="
          w-full
          py-3
          outline-none
          "

          />


        </div>


      </div>




      {/* User Email */}

      <div>

        <label
        className="
        text-sm
        font-semibold
        text-slate-700
        "
        >

          User Email

        </label>


        <div
        className="
        flex
        items-center
        gap-3
        border
        rounded-xl
        px-4
        mt-2
        "
        >

          <FaUser
          className="
          text-blue-600
          "
          />


          <select

          name="userEmail"

          value={
            formData.userEmail
          }

          onChange={handleChange}

          className="
          w-full
          py-3
          outline-none
          bg-transparent
          "

          >

            <option value="">
              Select User Email
            </option>

            {
            usersList?.map(
              (user)=>(

              <option

              key={
                user._id
              }

              value={
                user.email
              }

              >

              {
              `${user.name} (${user.email})`
              }

              </option>

            ))
            }

          </select>

        </div>


      </div>








      {/* Achievement */}

      <div>

        <label
        className="
        text-sm
        font-semibold
        "
        >

          Achievement

        </label>



        <div
        className="
        flex
        items-center
        gap-3
        border
        rounded-xl
        px-4
        mt-2
        "
        >

          <FaTrophy
          className="
          text-orange-500
          "
          />


          <select

          name="achievementId"

          value={
            formData.achievementId
          }

          onChange={handleChange}

          className="
          w-full
          py-3
          outline-none
          "
          >


            <option value="">
              Select Achievement
            </option>



            {
            achievements?.map(
              (item)=>(

              <option

              key={
                item._id
              }

              value={
                item._id
              }

              >

              {
              item.title
              }

              </option>


            ))
            }



          </select>



        </div>



      </div>









      {/* Badge */}

      <div>


        <label
        className="
        text-sm
        font-semibold
        "
        >

          Badge Name

        </label>



        <div
        className="
        flex
        items-center
        gap-3
        border
        rounded-xl
        px-4
        mt-2
        "
        >

          <FaAward
          className="
          text-yellow-500
          "
          />


          <select


          name="badgeName"


          value={
            formData.badgeName
          }


          onChange={
            handleChange
          }

          className="
          w-full
          py-3
          outline-none
          bg-transparent
          "

          >

            <option value="">
              Select Badge Name
            </option>

            {
            badges?.map(
              (badge)=>(

              <option

              key={
                badge._id
              }

              value={
                badge.title
              }

              >

              {
              `${badge.title} (${badge.description})`
              }

              </option>

            ))
            }

          </select>


        </div>


      </div>









      <button

      disabled={loading}

      className="
      w-full
      py-3
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-semibold
      disabled:opacity-50
      "
      >


      {
      loading
      ?
      "Giving Reward..."
      :
      "Give Reward"
      }


      </button>





    </form>

  );

};



export default RewardForm;