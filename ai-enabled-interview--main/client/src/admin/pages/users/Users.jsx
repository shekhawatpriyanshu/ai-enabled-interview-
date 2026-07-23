import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserShield,
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
            color: "bg-blue-600",
        },
        {
            title: "Verified",
            value: stats.verifiedUsers || 0,
            icon: <FaUserCheck />,
            color: "bg-green-600",
        },
        {
            title: "Blocked",
            value: stats.blockedUsers || 0,
            icon: <FaUserSlash />,
            color: "bg-red-600",
        },
    ];

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Delete this user?"
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
        <div className="space-y-6">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        User Management
                    </h1>

                    <p className="text-gray-500">
                        Manage all registered users
                    </p>

                </div>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {cards.map((card, index) => (

                    <div
                        key={index}
                        className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
                    >

                        <div>

                            <p className="text-gray-500">
                                {card.title}
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {card.value}
                            </h2>

                        </div>

                        <div
                            className={`${card.color} text-white p-4 rounded-xl text-3xl`}
                        >
                            {card.icon}
                        </div>

                    </div>

                ))}

            </div>

            {/* Filters */}

            <UserFilters
                onSearch={searchUsers}
                onRole={filterRole}
                onVerified={filterVerified}
                onBlocked={filterBlocked}
                onSort={sortUsers}
            />

            {/* Error */}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading */}

            {loading ? (

                <div className="bg-white rounded-xl p-20 text-center">

                    <h2 className="text-xl">
                        Loading users...
                    </h2>

                </div>

            ) : (<>
                <UserTable
                    users={users}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onBlock={handleBlock}
                    onRole={handleRole}
                />

                {users.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <h2 className="text-2xl font-semibold text-gray-600">
                            No Users Found
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Try changing search or filters.
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