import {
  FaEye,
  FaTrash,
  FaUser,
  FaTrophy,
  FaAward,
} from "react-icons/fa";



const RewardTable = ({
  rewards = [],
  loading = false,
  currentPage = 1,
  pageSize = 10,
  onView,
  onDelete,
}) => {



  // ==========================
  // Loading
  // ==========================

  if(loading){

    return (

      <div
      className="
      flex
      flex-col
      justify-center
      items-center
      py-16
      bg-white
      rounded-2xl
      border
      "
      >

        <div
        className="
        h-10
        w-10
        border-4
        border-blue-500/30
        border-t-blue-600
        rounded-full
        animate-spin
        "
        />

        <p
        className="
        mt-4
        text-sm
        text-slate-500
        "
        >

          Loading Rewards...

        </p>


      </div>

    );

  }




  // ==========================
  // Empty
  // ==========================

  if(!rewards.length){

    return (

      <div
      className="
      py-16
      bg-white
      rounded-2xl
      border
      text-center
      text-slate-500
      "
      >

        No Rewards Found

      </div>

    );

  }




  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left w-16">#</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">User</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Achievement</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Badge</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Reward</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Date</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rewards.map((reward, index) => (
            <tr key={reward._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500 text-left">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{reward.user?.name || "N/A"}</p>
                    <p className="text-xs text-slate-500">{reward.user?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                    <FaTrophy className="text-orange-500 text-xs" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 line-clamp-1">{reward.achievement?.title || "N/A"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-100">
                    <FaAward className="text-yellow-500 text-xs" />
                  </div>
                  <span className="text-sm text-slate-600 line-clamp-1">{reward.badge?.title || "No Badge"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {reward.rewardPoints || 0} XP
                </span>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {new Date(reward.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onView(reward)}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onDelete(reward)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};



export default RewardTable;