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

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Rewards */}
      <StatisticsCard
        title="Total Rewards"
        value={dashboard.totalRewards}
        icon={<FaGift />}
        bgGradient="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white hover:from-blue-100/90 hover:to-indigo-50"
        borderColor="border-blue-200/80 hover:border-blue-400"
        iconBg="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
        textClass="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
      />

      {/* 2. Users Rewarded */}
      <StatisticsCard
        title="Users Rewarded"
        value={dashboard.totalUsersRewarded}
        icon={<FaUsers />}
        bgGradient="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white hover:from-emerald-100/90 hover:to-teal-50"
        borderColor="border-emerald-200/80 hover:border-emerald-400"
        iconBg="bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30"
        textClass="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent"
      />

      {/* 3. Achievements */}
      <StatisticsCard
        title="Achievements"
        value={dashboard.totalAchievements}
        icon={<FaTrophy />}
        bgGradient="bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white hover:from-amber-100/90 hover:to-yellow-50"
        borderColor="border-amber-200/80 hover:border-amber-400"
        iconBg="bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/30"
        textClass="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent"
      />

      {/* 4. Badges */}
      <StatisticsCard
        title="Badges"
        value={dashboard.totalBadges}
        icon={<FaAward />}
        bgGradient="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/50 to-white hover:from-purple-100/90 hover:to-fuchsia-50"
        borderColor="border-purple-200/80 hover:border-purple-400"
        iconBg="bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-purple-500/30"
        textClass="bg-gradient-to-r from-purple-700 to-fuchsia-700 bg-clip-text text-transparent"
      />
    </div>

  );

};



export default DashboardCards;