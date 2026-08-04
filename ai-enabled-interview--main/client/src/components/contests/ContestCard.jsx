import { Link } from "react-router-dom";
import {
  Calendar,
  Clock3,
  FileCode2,
  Trophy,
  ArrowRight,
} from "lucide-react";

const statusColors = {
  Upcoming:
    "bg-yellow-50 text-yellow-700 border-yellow-200/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
  Live:
    "bg-green-50 text-green-700 border-green-200/50 shadow-[0_0_10px_rgba(34,197,94,0.2)] animate-pulse",
  Completed:
    "bg-gray-50 text-gray-600 border-gray-200/50",
};

const ContestCard = ({ contest }) => {
  return (
    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,_70,_229,_0.15)] transition-all duration-500 p-6 md:p-8 flex flex-col h-full hover:-translate-y-1 relative overflow-hidden">
      
      {/* Decorative Gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
            {contest.title}
          </h2>
          <p className="text-gray-500 mt-2 line-clamp-2 font-medium">
            {contest.description}
          </p>
        </div>

        <div
          className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase ${
            statusColors[contest.status]
          }`}
        >
          {contest.status}
        </div>
      </div>

      {/* Information */}
      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        <div className="flex items-center gap-3 text-gray-600 bg-gray-50/80 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors cursor-default">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Calendar size={16} className="text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-gray-700 leading-tight">
            {new Date(contest.startTime).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 bg-gray-50/80 p-2.5 rounded-xl group-hover:bg-purple-50 transition-colors cursor-default">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-purple-100 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Clock3 size={16} className="text-purple-600" />
          </div>
          <span className="text-sm font-bold text-gray-700 leading-tight">
            {contest.duration} mins
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 bg-gray-50/80 p-2.5 rounded-xl group-hover:bg-blue-50 transition-colors cursor-default">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-blue-100 rounded-lg group-hover:-translate-y-1 transition-transform duration-300">
            <FileCode2 size={16} className="text-blue-600" />
          </div>
          <span className="text-sm font-bold text-gray-700 leading-tight">
            {contest.problems?.length || 0} Problems
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 bg-gray-50/80 p-2.5 rounded-xl group-hover:bg-orange-50 transition-colors cursor-default">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-orange-100 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Trophy size={16} className="text-orange-600" />
          </div>
          <span className="text-sm font-bold text-gray-700 leading-tight">
            Contest
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end relative z-10">
        <Link
          to={`/contests/${contest._id}`}
          className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-indigo-500/30 hover:pr-4 group/btn"
        >
          View Details
          <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ContestCard;