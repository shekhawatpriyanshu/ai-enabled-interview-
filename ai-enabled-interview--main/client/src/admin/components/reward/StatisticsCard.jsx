const StatisticsCard = ({
  title,
  value,
  icon,
  loading = false,
}) => {


  return (

    <div
    className="
    bg-white
    rounded-2xl
    border
    border-slate-200
    shadow-sm
    p-5
    hover:shadow-md
    transition
    "
    >


      <div
      className="
      flex
      justify-between
      items-start
      "
      >


        <div>


          <p
          className="
          text-sm
          font-medium
          text-slate-500
          "
          >

            {title}

          </p>



          {
            loading ? (

              <div
              className="
              mt-3
              h-8
              w-20
              bg-slate-200
              animate-pulse
              rounded-lg
              "
              />


            ) : (

              <h2
              className="
              mt-3
              text-3xl
              font-bold
              text-slate-900
              "
              >

                {value || 0}

              </h2>

            )
          }



        </div>





        <div
        className="
        h-12
        w-12
        flex
        items-center
        justify-center
        rounded-xl
        bg-blue-50
        text-blue-600
        text-xl
        "
        >

          {icon}

        </div>




      </div>



    </div>

  );

};



export default StatisticsCard;