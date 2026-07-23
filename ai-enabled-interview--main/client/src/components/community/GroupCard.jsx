import { Link } from "react-router-dom";
import {
  Users,
  User,
  ArrowRight,
} from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const GroupCard = ({ group }) => {
  const { joinStudyGroup } = useCommunity();

  const handleJoin = async () => {
    try {
      await joinStudyGroup(group._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 p-6 flex flex-col justify-between min-h-[220px]">

      {/* Main info */}
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {group.name}
            </h2>

            <p className="text-slate-500 mt-1.5 text-sm line-clamp-2 leading-relaxed">
              {group.description}
            </p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 text-slate-600 text-xs mb-2.5">
          <User size={15} className="text-slate-400" />
          <span>
            Owner: <span className="font-semibold text-slate-700">{group.owner?.name || "Unknown"}</span>
          </span>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 text-slate-600 text-xs mb-5">
          <Users size={15} className="text-slate-400" />
          <span>
            <span className="font-semibold text-slate-700">{group.members?.length || 0}</span> Members
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
        <button
          onClick={handleJoin}
          className="px-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm font-semibold text-xs transition-all duration-200 hover:scale-[1.02]"
        >
          Join Group
        </button>

        <Link
          to={`/community/groups/${group._id}`}
          className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 font-semibold text-sm transition duration-200"
        >
          View Group
          <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
};

export default GroupCard;