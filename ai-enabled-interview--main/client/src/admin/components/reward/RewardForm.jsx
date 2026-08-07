import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaTrophy,
  FaAward,
  FaCoins,
  FaSearch,
  FaCheck,
  FaGift,
  FaArrowLeft,
} from "react-icons/fa";

import useAchievement from "../../../admin/hooks/useAchievement";
import useBadge from "../../../admin/hooks/useBadge";
import { getUsers } from "../../services/userService";

const RewardForm = ({
  onSubmit,
  loading = false,
}) => {
  const navigate = useNavigate();


  const {
    achievements,
    getAchievements,
  } = useAchievement();

  const {
    badges,
    getBadges,
  } = useBadge();

  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState("");



  const [formData, setFormData] =
    useState({

      userEmail: "",

      achievementId: "",

      badgeName: "",

      rewardPoints: ""

    });





  useEffect(() => {

    getAchievements();
    getBadges();

    const fetchUsers = async () => {
      try {
        const res = await getUsers({ limit: 1000 });
        if (res && res.users) {
          setUsersList(res.users);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();

  }, []);







  const handleChange = (e) => {


    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });


  };






  const handleSubmit = (e) => {

    e.preventDefault();


    onSubmit(formData);


  };








  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-xl bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl transition-all duration-300"
    >
      {/* Page Title & Header inside single card */}
      <div className="border-b border-slate-100 pb-5 space-y-3">
        <button
          type="button"
          onClick={() => navigate("/admin/rewards")}
          className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Rewards
        </button>
        <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 tracking-tight">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <FaGift />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Give Manual Reward
          </span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1.5">
          Assign achievement rewards, XP points, and badges directly to users.
        </p>
      </div>
      {/* 1. Recipient User (Custom Searchable Card List) */}
      <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaUser className="text-sm" />
            </div>
            Select Recipient User <span className="text-rose-500">*</span>
          </label>
          {formData.userEmail && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              <FaCheck className="text-[10px]" /> Selected
            </span>
          )}
        </div>

        {/* Search input for users */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <FaSearch className="text-xs" />
          </div>
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* User Card List */}
        <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {usersList
            ?.filter(
              (u) =>
                u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email?.toLowerCase().includes(userSearch.toLowerCase())
            )
            .map((user) => {
              const isSelected = formData.userEmail === user.email;
              return (
                <div
                  key={user._id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      userEmail: user.email,
                    }))
                  }
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.01]"
                    : "bg-white border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0 ${isSelected
                        ? "bg-white text-blue-600"
                        : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-800"
                          }`}
                      >
                        {user.name}
                      </h4>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-500"
                          }`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <FaCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>
              );
            })}
          {usersList?.filter(
            (u) =>
              u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
              u.email?.toLowerCase().includes(userSearch.toLowerCase())
          ).length === 0 && (
              <p className="text-xs text-center py-4 text-slate-400 font-medium">
                No matching users found.
              </p>
            )}
        </div>
      </div>

      {/* 2. XP Points Card */}
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all duration-300 space-y-4">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <FaCoins className="text-sm" />
          </div>
          Reward XP Points
        </label>

        {/* Quick XP Buttons */}
        <div className="flex flex-wrap gap-2">
          {[50, 100, 250, 500, 1000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rewardPoints: amount.toString() }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${formData.rewardPoints === amount.toString()
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100/60 hover:-translate-y-0.5"
                }`}
            >
              +{amount} XP
            </button>
          ))}
        </div>

        <input
          type="number"
          name="rewardPoints"
          value={formData.rewardPoints}
          onChange={handleChange}
          placeholder="Or enter custom XP amount..."
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      {/* 3. Badges Card */}
      <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition-all duration-300 space-y-4">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <FaAward className="text-sm" />
          </div>
          Select Badge (Optional)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
          {badges?.map((badge) => {
            const isSelected = formData.badgeName === badge.title;
            return (
              <div
                key={badge._id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    badgeName: isSelected ? "" : badge.title,
                  }))
                }
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 ${isSelected
                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]"
                  : "bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 hover:-translate-y-0.5"
                  }`}
              >
                <FaAward className={`text-xl ${isSelected ? "text-purple-200" : "text-purple-500"}`} />
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}>
                    {badge.title}
                  </h4>
                  <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Achievements Card */}
      <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-md transition-all duration-300 space-y-4">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <FaTrophy className="text-sm" />
          </div>
          Select Achievement (Optional)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
          {achievements?.map((item) => {
            const isSelected = formData.achievementId === item._id;
            return (
              <div
                key={item._id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    achievementId: isSelected ? "" : item._id,
                  }))
                }
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 ${isSelected
                  ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.02]"
                  : "bg-white border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 hover:-translate-y-0.5"
                  }`}
              >
                <FaTrophy className={`text-xl ${isSelected ? "text-amber-200" : "text-amber-500"}`} />
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}>
                    {item.title}
                  </h4>
                  <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-amber-100" : "text-slate-400"}`}>
                    {item.category || "Achievement"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:via-rose-600 hover:to-indigo-700 text-white font-extrabold text-base tracking-wide shadow-lg hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Assigning Rewards..." : "✨ Give Reward Now"}
        </button>
      </div>
    </form>
  );
};

export default RewardForm;