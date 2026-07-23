import {
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";


const DeleteModal = ({
  reward,
  onClose,
  onConfirm,
  loading = false,
}) => {


  if(!reward){
    return null;
  }



  return (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-50
    px-4
    "
    >


      <div
      className="
      bg-white
      rounded-2xl
      shadow-xl
      w-full
      max-w-md
      p-6
      "
      >



        {/* Icon */}

        <div
        className="
        flex
        justify-center
        mb-5
        "
        >

          <div
          className="
          h-14
          w-14
          rounded-full
          bg-red-50
          flex
          items-center
          justify-center
          text-red-600
          text-2xl
          "
          >

            <FaExclamationTriangle/>

          </div>


        </div>






        <h2
        className="
        text-xl
        font-bold
        text-center
        text-slate-900
        "
        >

          Delete Reward?

        </h2>



        <p
        className="
        text-center
        text-sm
        text-slate-500
        mt-3
        "
        >

          Are you sure you want to remove this reward?


        </p>






        {/* Reward Info */}

        <div
        className="
        bg-slate-50
        rounded-xl
        p-4
        mt-5
        "
        >


          <p
          className="
          text-sm
          text-slate-600
          "
          >

            User:

            <span
            className="
            font-semibold
            text-slate-900
            ml-1
            "
            >

              {
              reward.user?.name ||
              "Unknown"
              }

            </span>

          </p>




          <p
          className="
          text-sm
          text-slate-600
          mt-2
          "
          >

            Achievement:

            <span
            className="
            font-semibold
            text-slate-900
            ml-1
            "
            >

              {
              reward.achievement?.title ||
              "N/A"
              }

            </span>

          </p>



        </div>









        {/* Buttons */}

        <div
        className="
        flex
        gap-3
        mt-6
        "
        >



          <button

          onClick={onClose}

          className="
          flex-1
          py-3
          rounded-xl
          border
          border-slate-200
          text-slate-600
          font-semibold
          hover:bg-slate-50
          "
          >

            <span
            className="
            flex
            items-center
            justify-center
            gap-2
            "
            >

              <FaTimes/>

              Cancel

            </span>


          </button>







          <button


          disabled={loading}


          onClick={onConfirm}


          className="
          flex-1
          py-3
          rounded-xl
          bg-red-600
          hover:bg-red-700
          text-white
          font-semibold
          disabled:opacity-50
          "

          >

            <span
            className="
            flex
            items-center
            justify-center
            gap-2
            "
            >

              <FaTrash/>

              {
              loading
              ?
              "Deleting..."
              :
              "Delete"
              }


            </span>


          </button>




        </div>




      </div>



    </div>

  );

};



export default DeleteModal;