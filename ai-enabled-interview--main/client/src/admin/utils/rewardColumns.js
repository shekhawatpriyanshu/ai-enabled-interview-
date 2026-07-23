import {
  FaUser,
  FaTrophy,
  FaAward,
  FaCoins,
  FaCalendarAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";



const rewardColumns = ({
  onView,
  onDelete,
}) => [

  {


    key: "user",


    title: "User",


    render: (reward) => (

      <div
      className="
      flex
      items-center
      gap-3
      "
      >

        <FaUser
        className="
        text-blue-600
        "
        />


        <div>

          <p
          className="
          text-sm
          font-semibold
          text-slate-800
          "
          >

            {
            reward.user?.name ||
            "N/A"
            }

          </p>


          <p
          className="
          text-xs
          text-slate-500
          "
          >

            {
            reward.user?.email
            }

          </p>


        </div>


      </div>

    )

  },





  {


    key:"achievement",


    title:"Achievement",


    render:(reward)=>(

      <div
      className="
      flex
      items-center
      gap-2
      "
      >

        <FaTrophy
        className="
        text-orange-500
        "
        />


        <span>

        {
        reward.achievement?.title
        ||
        "N/A"
        }

        </span>


      </div>

    )

  },





  {


    key:"badge",


    title:"Badge",


    render:(reward)=>(


      <div
      className="
      flex
      items-center
      gap-2
      "
      >

        <FaAward
        className="
        text-yellow-500
        "
        />


        <span>

        {
        reward.badge?.title
        ||
        "No Badge"
        }

        </span>


      </div>


    )


  },






  {


    key:"rewardPoints",


    title:"Reward",


    render:(reward)=>(

      <span
      className="
      px-3
      py-1
      rounded-full
      bg-green-50
      text-green-700
      text-xs
      font-semibold
      "
      >

      {
      reward.rewardPoints || 0
      }
      XP


      </span>


    )


  },






  {


    key:"earnedAt",


    title:"Earned Date",


    render:(reward)=>(


      <div
      className="
      flex
      items-center
      gap-2
      text-sm
      text-slate-500
      "
      >

        <FaCalendarAlt/>


        {
        new Date(
          reward.earnedAt
        )
        .toLocaleDateString()
        }


      </div>


    )


  },







  {


    key:"actions",


    title:"Actions",


    render:(reward)=>(


      <div
      className="
      flex
      gap-2
      "
      >


        <button

        onClick={()=>
          onView(reward)
        }


        className="
        p-2
        rounded-lg
        bg-blue-50
        text-blue-600
        "
        >

          <FaEye/>

        </button>





        <button


        onClick={()=>
          onDelete(reward)
        }


        className="
        p-2
        rounded-lg
        bg-red-50
        text-red-600
        "
        >

          <FaTrash/>

        </button>



      </div>


    )


  }



];



export default rewardColumns;