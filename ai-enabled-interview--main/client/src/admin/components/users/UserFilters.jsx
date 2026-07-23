import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const UserFilters = ({
    onSearch,
    onRole,
    onVerified,
    onBlocked,
    onSort,
}) => {
    const [keyword, setKeyword] =
        useState("");

    const handleSearch = (e) => {
        const value = e.target.value;

        setKeyword(value);

        onSearch(value);
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Search */}
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400 flex items-center justify-center pointer-events-none">
                        <FaSearch className="w-4 h-4" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={keyword}
                        onChange={handleSearch}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                    />
                </div>

                {/* Role */}


                {/* Verified */}

                <select
                    onChange={(e) =>
                        onVerified(e.target.value)
                    }
                    className="border rounded-lg p-3"
                >
                    <option value="">
                        Verification
                    </option>

                    <option value="true">
                        Verified
                    </option>

                    <option value="false">
                        Not Verified
                    </option>

                </select>

                {/* Blocked */}

                <select
                    onChange={(e) =>
                        onBlocked(e.target.value)
                    }
                    className="border rounded-lg p-3"
                >
                    <option value="">
                        Status
                    </option>

                    <option value="false">
                        Active
                    </option>

                    <option value="true">
                        Blocked
                    </option>

                </select>

                {/* Sort */}

                <select
                    onChange={(e) =>
                        onSort(e.target.value)
                    }
                    className="border rounded-lg p-3"
                >
                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>

                </select>

            </div>

        </div>
    );
};

export default UserFilters;