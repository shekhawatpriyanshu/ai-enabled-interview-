import { useState } from "react";
import { FaSearch, FaCheckCircle, FaBan, FaSortAmountDown } from "react-icons/fa";

const UserFilters = ({
    onSearch,
    onRole,
    onVerified,
    onBlocked,
    onSort,
}) => {
    const [keyword, setKeyword] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setKeyword(value);
        onSearch(value);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-center">
                {/* Search */}
                <div className="relative flex items-center col-span-1">
                    <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                        <FaSearch className="w-4 h-4" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={keyword}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm"
                    />
                </div>

                {/* Verification */}
                <div className="relative flex items-center col-span-1">
                    <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <select
                        onChange={(e) => onVerified(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
                    >
                        <option value="" className="bg-white font-normal text-slate-800 py-1">
                            Verification Status
                        </option>
                        <option value="true" className="bg-white font-normal text-slate-800 py-1">
                            Verified Only
                        </option>
                        <option value="false" className="bg-white font-normal text-slate-800 py-1">
                            Not Verified
                        </option>
                    </select>
                </div>

                {/* Blocked */}
                <div className="relative flex items-center col-span-1">
                    <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                        <FaBan className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <select
                        onChange={(e) => onBlocked(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
                    >
                        <option value="" className="bg-white font-normal text-slate-800 py-1">
                            Account Status
                        </option>
                        <option value="false" className="bg-white font-normal text-slate-800 py-1">
                            🟢 Active
                        </option>
                        <option value="true" className="bg-white font-normal text-slate-800 py-1">
                            🔴 Blocked
                        </option>
                    </select>
                </div>

                {/* Sort */}
                <div className="relative flex items-center col-span-1">
                    <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                        <FaSortAmountDown className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <select
                        onChange={(e) => onSort(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
                    >
                        <option value="newest" className="bg-white font-normal text-slate-800 py-1">
                            Newest First
                        </option>
                        <option value="oldest" className="bg-white font-normal text-slate-800 py-1">
                            Oldest First
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default UserFilters;