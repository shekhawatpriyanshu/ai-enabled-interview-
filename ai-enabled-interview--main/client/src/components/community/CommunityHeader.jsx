import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Users,
  MessageSquare,
} from "lucide-react";

const CommunityHeader = ({
  search = "",
  setSearch = () => {},
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Community Hub
          </h1>

          <p className="text-slate-500 mt-2 text-sm max-w-xl leading-relaxed">
            Discuss interview questions, join study groups, and collaborate with other preparers on their journeys.
          </p>
        </div>

        {/* Right - Actions */}
        <div className="flex flex-wrap gap-3">

          <Link
            to="/community/create-discussion"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md shadow-cyan-500/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <PlusCircle size={18} />
            New Discussion
          </Link>

          <Link
            to="/community/create-group"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md shadow-purple-500/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <Users size={18} />
            Create Group
          </Link>

        </div>

      </div>

      {/* Search Input */}
      <div className="relative mt-6">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search discussions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50 hover:bg-slate-50 transition outline-none text-slate-700 placeholder-slate-400 text-sm"
        />
      </div>

      {/* Quick Navigation Tab Pills */}
      <div className="flex flex-wrap gap-2.5 mt-5">
        <Link
          to="/community/discussions"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 hover:border-cyan-500/50 hover:bg-cyan-50/40 text-slate-600 hover:text-cyan-600 font-semibold text-xs transition duration-200"
        >
          <MessageSquare size={14} />
          Discussions
        </Link>

        <Link
          to="/community/groups"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 hover:border-purple-500/50 hover:bg-purple-50/40 text-slate-600 hover:text-purple-600 font-semibold text-xs transition duration-200"
        >
          <Users size={14} />
          Study Groups
        </Link>
      </div>

    </div>
  );
};

export default CommunityHeader;