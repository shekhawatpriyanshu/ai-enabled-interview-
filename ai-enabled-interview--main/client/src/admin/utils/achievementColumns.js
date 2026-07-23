import {
  FaTrophy,
  FaBullseye,
  FaCoins,
  FaTag,
  FaToggleOn,
  FaCalendarAlt,
} from "react-icons/fa";


const achievementColumns = [

  {
    key: "title",

    label: "Achievement",

    icon: FaTrophy,

    render: (achievement) => (
      <div>
        <p className="font-semibold text-slate-800">
          {achievement.title}
        </p>

        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
          {achievement.description}
        </p>
      </div>
    ),
  },


  {
    key: "category",

    label: "Category",

    icon: FaTag,

    render: (achievement) => (
      <span
        className="
          px-3 py-1 
          rounded-full 
          text-xs 
          font-semibold
          bg-blue-50
          text-blue-700
          border
          border-blue-200
        "
      >
        {achievement.category}
      </span>
    ),
  },


  {
    key: "target",

    label: "Target",

    icon: FaBullseye,

    render: (achievement) => (
      <span className="font-semibold">
        {achievement.target}
      </span>
    ),
  },


  {
    key: "rewardPoints",

    label: "Reward",

    icon: FaCoins,

    render: (achievement) => (
      <span className="font-semibold text-amber-600">
        {achievement.rewardPoints || 0} XP
      </span>
    ),
  },


  {
    key: "status",

    label: "Status",

    icon: FaToggleOn,

    render: (achievement) => (
      <span
        className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold
          ${
            achievement.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        `}
      >
        {
          achievement.isActive
            ? "Active"
            : "Inactive"
        }
      </span>
    ),
  },


  {
    key: "createdAt",

    label: "Created",

    icon: FaCalendarAlt,

    render: (achievement) => (
      <span className="text-sm text-slate-500">
        {
          new Date(
            achievement.createdAt
          )
          .toLocaleDateString()
        }
      </span>
    ),
  },


];


export default achievementColumns;