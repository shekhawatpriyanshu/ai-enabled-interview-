import StatisticsCard from "./StatisticsCard";

import {
  FaGift,
  FaUsers,
  FaTrophy,
  FaAward,
} from "react-icons/fa";



const DashboardCards = ({
  dashboard
}) => {


  if(!dashboard){

    return null;

  }




  return (

    <div
    className="
    grid
    md:grid-cols-2
    lg:grid-cols-4
    gap-5
    "
    >



      <StatisticsCard

      title="Total Rewards"

      value={
        dashboard.totalRewards
      }

      icon={
        <FaGift/>
      }

      />





      <StatisticsCard

      title="Users Rewarded"

      value={
        dashboard.totalUsersRewarded
      }

      icon={
        <FaUsers/>
      }

      />





      <StatisticsCard

      title="Achievements"

      value={
        dashboard.totalAchievements
      }

      icon={
        <FaTrophy/>
      }

      />





      <StatisticsCard

      title="Badges"

      value={
        dashboard.totalBadges
      }

      icon={
        <FaAward/>
      }

      />



    </div>

  );

};



export default DashboardCards;