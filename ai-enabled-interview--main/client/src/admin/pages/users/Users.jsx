import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";

import useUsers from "../../hooks/useUsers";

import UserFilters from "../../../admin/components/users/UserFilters";
import UserTable from "../../../admin/components/users/UserTable";
import Pagination from "../../../admin/components/users/Pagination";

const Users = () => {
    const navigate = useNavigate();

    const {
        users,
        stats,
        pagination,
        loading,
        error,

        searchUsers,
        filterRole,
        filterVerified,
        filterBlocked,
        sortUsers,
        changePage,

        removeUser,
        toggleBlock,
        updateRole,
    } = useUsers();

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: <FaUsers />,
            gradient: "from-indigo-600 to-blue-600",
            cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border-indigo-200/80",
            topAccent: "bg-gradient-to-r from-indigo-500 to-blue-600",
            iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/25",
        },
        {
            title: "Verified Users",
            value: stats.verifiedUsers || 0,
            icon: <FaUserCheck />,
            gradient: "from-emerald-600 to-teal-600",
            cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/80",
            topAccent: "bg-gradient-to-r from-emerald-500 to-teal-600",
            iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/25",
        },
        {
            title: "Blocked Users",
            value: stats.blockedUsers || 0,
            icon: <FaUserSlash />,
            gradient: "from-rose-600 to-pink-600",
            cardBg: "bg-gradient-to-br from-rose-50/80 via-white to-pink-50/40 border-rose-200/80",
            topAccent: "bg-gradient-to-r from-rose-500 to-pink-600",
            iconBg: "bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-rose-500/25",
        },
    ];

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        removeUser(id);
    };

    const handleBlock = (id) => {
        toggleBlock(id);
    };

    const handleRole = (id, role) => {
        updateRole(id, role);
    };

    const handleView = (id) => {
        navigate(`/admin/users/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/admin/users/edit/${id}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-bounce">
                            <FaUsers />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                            User Management
                        </span>
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 mt-2">
                        Manage, verify, and inspect all registered platform candidates and system users.
                    </p>
                </div>
            </div>

            {/* 2. Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`group ${card.cardBg} rounded-2xl border p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden`}
                    >
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.topAccent}`} />

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="space-y-1.5 min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    {card.title}
                                </p>
                                <h2 className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0`}
                            >
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Filters */}
            <UserFilters
                onSearch={searchUsers}
                onRole={filterRole}
                onVerified={filterVerified}
                onBlocked={filterBlocked}
                onSort={sortUsers}
            />

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl font-semibold text-sm">
                    {error}
                </div>
            )}

            {/* Loading / Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
                    <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Loading User Database...
                    </p>
                </div>
            ) : (
                <>
                    <UserTable
                        users={users}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onBlock={handleBlock}
                        onRole={handleRole}
                    />

                    {users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-2">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 animate-bounce">
                                <FaUsers />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">No Users Found</h3>
                            <p className="text-slate-500 text-xs font-medium">
                                Try adjusting your search query or dropdown filter criteria.
                            </p>
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={changePage}
                        />
                    )}
                </>
            )}

        </div>
    );
};

export default Users;