import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaMedal, FaCoins, FaUser } from "react-icons/fa";

import useContest from "../../hooks/useContest";

const ContestLeaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { leaderboard, loading, loadLeaderboard } = useContest();

  useEffect(() => {
    loadLeaderboard(id);
  }, [id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate(`/admin/contests/${id}`)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-purple-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Contest Details
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
              <FaTrophy />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Contest Leaderboard
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Real-time participant rankings based on total score and speed.
          </p>
        </div>
      </div>

      {/* 2. LEADERBOARD TABLE */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-24">
                Rank
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Participant Name
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Total Score
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Submitted At
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Loading Leaderboard Rankings...
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && leaderboard.length === 0 && (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-400 font-bold text-xs">
                  No leaderboard records found for this contest yet.
                </td>
              </tr>
            )}

            {!loading &&
              leaderboard.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gradient-to-r hover:from-amber-50/60 hover:via-purple-50/30 hover:to-indigo-50/40 transition-all duration-300 group"
                >
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                      {index === 0 && (
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                          <FaMedal className="text-base" />
                        </span>
                      )}
                      {index === 1 && (
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-400 text-white flex items-center justify-center shadow-md">
                          <FaMedal className="text-base" />
                        </span>
                      )}
                      {index === 2 && (
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-md">
                          <FaMedal className="text-base" />
                        </span>
                      )}
                      {index > 2 && <span className="text-slate-400 font-bold">#{item.rank}</span>}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
                        {item.user?.name ? item.user.name.charAt(0).toUpperCase() : <FaUser />}
                      </div>
                      <p className="font-black text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                        {item.user?.name || "Participant"}
                      </p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {item.user?.email || "-"}
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black shadow-sm">
                      <FaCoins className="text-amber-500 text-xs" />
                      {item.score} PTS
                    </span>
                  </td>

                  {/* Submitted */}
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestLeaderboard;