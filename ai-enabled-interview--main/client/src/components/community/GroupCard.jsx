import { Link } from "react-router-dom";
import {
  Users,
  User,
  ArrowRight,
  Sparkles,
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
    <div className="group bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 rounded-3xl p-5 sm:p-6 border border-emerald-200/90 shadow-sm hover:shadow-xl hover:scale-[1.015] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
      {/* Top Emerald Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500" />

      <div className="space-y-3.5">
        {/* Card Top Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
            <Sparkles size={12} className="text-emerald-600 animate-pulse shrink-0" />
            <span>Study Group</span>
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-slate-700 text-xs font-black shadow-2xs shrink-0">
            <Users size={14} className="text-emerald-600 shrink-0" />
            <span><strong className="text-emerald-700 font-extrabold">{group.members?.length || 0}</strong> Members</span>
          </div>
        </div>

        {/* Group Name */}
        <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight leading-snug break-words">
          {group.name}
        </h2>

        {/* Group Description */}
        <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs break-words">
          {group.description || "Active community study group focused on interview preparation and practice."}
        </p>

        {/* Owner Info Bar */}
        <div className="flex items-center justify-between gap-2 bg-white/90 border border-emerald-200/80 p-3 rounded-2xl text-xs shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <User size={14} className="text-emerald-600 shrink-0" />
            <span className="text-slate-500 font-bold uppercase text-[10px]">Owner:</span>
            <span className="font-extrabold text-slate-900 truncate">{group.owner?.name || "Admin"}</span>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-emerald-100/80 mt-4">
        <button
          type="button"
          onClick={handleJoin}
          className="flex-1 py-2.5 rounded-2xl bg-white border border-emerald-200/90 text-emerald-800 font-black text-xs uppercase tracking-wider hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 text-center"
        >
          Join Group
        </button>

        <Link
          to={`/community/groups/${group._id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
        >
          <span>View Group</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;