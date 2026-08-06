import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaUser, FaCheckCircle, FaCoins } from "react-icons/fa";

import ContestService from "../../services/ContestService";

const ContestParticipants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await ContestService.getParticipants(id);
      setParticipants(res.participants || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate(`/admin/contests/${id}`)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-emerald-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Contest Details
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 animate-bounce">
              <FaUsers />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Contest Participants
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Roster of all registered members who participated in this contest.
          </p>
        </div>
      </div>

      {/* 2. PARTICIPANTS TABLE */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-16">
                #
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Participant Name
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Score
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Solved / Total
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Joined Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Loading Participant Roster...
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && participants.length === 0 && (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-400 font-bold text-xs">
                  No participants registered for this contest yet.
                </td>
              </tr>
            )}

            {!loading &&
              participants.map((participant, index) => (
                <tr
                  key={participant._id}
                  className="hover:bg-gradient-to-r hover:from-emerald-50/60 hover:via-teal-50/30 hover:to-cyan-50/40 transition-all duration-300 group"
                >
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
                        {participant.user?.name ? participant.user.name.charAt(0).toUpperCase() : <FaUser />}
                      </div>
                      <p className="font-black text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {participant.user?.name || "Participant"}
                      </p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {participant.user?.email || "-"}
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black shadow-sm">
                      <FaCoins className="text-amber-500 text-xs" />
                      {participant.score || 0} PTS
                    </span>
                  </td>

                  {/* Solved / Total */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black shadow-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      {participant.solvedProblems || 0} / {participant.totalProblems || 0}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                    {new Date(participant.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestParticipants;