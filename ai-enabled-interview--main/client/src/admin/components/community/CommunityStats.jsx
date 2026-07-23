import { Link } from "react-router-dom";
import {
  FaComments,
  FaCommentDots,
  FaUsers,
  FaLayerGroup,
  FaUserFriends,
} from "react-icons/fa";

const CommunityStats = ({ stats, loading }) => {
  const cards = [
    {
      title: "Discussions",
      value: stats?.totalDiscussions || 0,
      icon: <FaComments />,
      color: "bg-blue-500",
      link: "/admin/community/discussions",
    },
    {
      title: "Comments",
      value: stats?.totalComments || 0,
      icon: <FaCommentDots />,
      color: "bg-green-500",
      link: "/admin/community/comments",
    },
    {
      title: "Study Groups",
      value: stats?.totalGroups || 0,
      icon: <FaLayerGroup />,
      color: "bg-purple-500",
      link: "/admin/community/groups",
    },
    {
      title: "Messages",
      value: stats?.totalMessages || 0,
      icon: <FaUsers />,
      color: "bg-orange-500",
      link: "/admin/community/messages",
    },
    {
      title: "Users",
      value: stats?.totalUsers || 0,
      icon: <FaUserFriends />,
      color: "bg-red-500",
      link: "/admin/users",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div
            className={`${card.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm mb-4 transition-transform group-hover:scale-105`}
          >
            {card.icon}
          </div>
          <div className="mt-auto">
            <p className="text-slate-500 text-sm font-medium">{card.title}</p>
            <h2 className="text-3xl font-bold mt-1 text-slate-900">
              {loading ? "..." : card.value}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommunityStats;