import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

import {
    FaUsers,
    FaUserTie,
    FaCode,
    FaComments,
    FaChartLine,
    FaSignOutAlt,
    FaCog,
    FaKey,
    FaTimes,
    FaArrowRight,
    FaCrown,
} from "react-icons/fa";

import adminApi from "../services/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAdminAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInterviews: 0,
        totalCodingProblems: 0,
        totalCommunities: 0,
        activeUsers: 0,
        recentActivity: [],
    });

    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showDataModal, setShowDataModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState("");
    const [modalData, setModalData] = useState([]);
    const [loadingModalData, setLoadingModalData] = useState(false);

    const loadDashboard = async () => {
        try {
            const res = await adminApi.get(
                "/auth/dashboard"
            );

            setStats(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        socket.on("active_users_count", (count) => {
            setStats((prev) => ({ ...prev, activeUsers: count }));
        });

        socket.on("new_activity", (activity) => {
            setStats((prev) => {
                const currentActivities = prev.recentActivity || [];
                if (currentActivities.some(a => a.text === activity.text && new Date(a.createdAt).getTime() === new Date(activity.createdAt).getTime())) {
                    return prev;
                }
                const updatedActivities = [activity, ...currentActivities].slice(0, 5);
                return { ...prev, recentActivity: updatedActivities };
            });
        });

        return () => {
            socket.off("active_users_count");
            socket.off("new_activity");
        };
    }, []);

    const formatTime = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getItemTitle = (item, type) => {
        switch (type) {
            case "Total Users":
            case "Online Users":
                return item.name || "Unknown User";

            case "Interviews Submitted":
                return item.role || item.user?.name || "Interview Session";

            case "Coding Problems":
                return item.title || item.name || "Coding Problem";

            case "Active Groups":
                return item.name || item.title || "Community";

            default:
                return item.name || item.title || "Item";
        }
    };

    const getItemSubtitle = (item, type) => {
        switch (type) {
            case "Total Users":
            case "Online Users":
                return item.email || "No email available";

            case "Interviews Submitted":
                return item.user?.name || item.user?.email || (item.createdAt ? formatTime(item.createdAt) : "Interview session");

            case "Coding Problems":
                return item.difficulty || item.topic || "Coding Problem";

            case "Active Groups":
                return item.description || `${item.membersCount || item.members?.length || 0} members`;

            default:
                return "";
        }
    };

    const getItemStatus = (item, type) => {
        switch (type) {
            case "Online Users":
                return "Online";

            case "Total Users":
                return item.isVerified ? "Verified" : "Unverified";

            case "Interviews Submitted":
                return item.status || "Submitted";

            case "Coding Problems":
                return item.difficulty || "Problem";

            case "Active Groups":
                return `${item.membersCount || item.members?.length || 0} Members`;

            default:
                return "View";
        }
    };

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <FaUsers />,
            gradient: "from-indigo-600 to-blue-600",
            cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 border-indigo-200/90",
            topBar: "from-indigo-500 via-blue-500 to-cyan-400",
            iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/30",
            glow: "hover:shadow-indigo-500/20",
        },
        {
            title: "Interviews Submitted",
            value: stats.totalInterviews,
            icon: <FaUserTie />,
            gradient: "from-emerald-600 to-teal-600",
            cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-200/90",
            topBar: "from-emerald-500 via-teal-500 to-cyan-400",
            iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30",
            glow: "hover:shadow-emerald-500/20",
        },
        {
            title: "Coding Problems",
            value: stats.totalCodingProblems,
            icon: <FaCode />,
            gradient: "from-purple-600 to-fuchsia-600",
            cardBg: "bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/40 border-purple-200/90",
            topBar: "from-purple-500 via-fuchsia-500 to-pink-400",
            iconBg: "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-purple-500/30",
            glow: "hover:shadow-purple-500/20",
        },
        {
            title: "Active Groups",
            value: stats.totalCommunities,
            icon: <FaComments />,
            gradient: "from-amber-600 to-orange-600",
            cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-200/90",
            topBar: "from-amber-500 via-orange-500 to-yellow-400",
            iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30",
            glow: "hover:shadow-amber-500/20",
        },
        {
            title: "Online Users",
            value: stats.activeUsers,
            icon: <FaChartLine />,
            gradient: "from-rose-600 to-pink-600",
            cardBg: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/40 border-rose-200/90",
            topBar: "from-rose-500 via-pink-500 to-red-400",
            iconBg: "bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-rose-500/30",
            glow: "hover:shadow-rose-500/20",
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-28">
                <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Loading Admin Dashboard...
                </p>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    const handleCardClick = async (cardTitle) => {
        setSelectedCard(cardTitle);
        setShowDataModal(true);
        setLoadingModalData(true);
        setModalData([]);

        try {
            let endpoint = "";

            switch (cardTitle) {
                case "Total Users":
                    endpoint = "/users?limit=100";
                    break;

                case "Interviews Submitted":
                    endpoint = "/interviews?limit=100";
                    break;

                case "Coding Problems":
                    endpoint = "/coding?limit=100";
                    break;

                case "Active Groups":
                    endpoint = "/community/groups?limit=100";
                    break;

                case "Online Users":
                    endpoint = "/auth/online-users";
                    break;

                default:
                    return;
            }

            const res = await adminApi.get(endpoint);
            const data = res.data;

            // Extract the correct array based on the response shape
            const items = data?.users
                || data?.interviews
                || data?.problems
                || data?.groups
                || data?.data
                || [];

            setModalData(items);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            setModalData([]);
        } finally {
            setLoadingModalData(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-bounce">
                            <FaCrown />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </span>
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 mt-2">
                        Real-time AI Interview Intelligence & Platform Analytics
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                        <FaCog className={`transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
                        <span>Settings</span>
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-20 animate-fade-in">
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    navigate("/admin/forgot-password");
                                }}
                                className="w-full text-left px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 border-b border-slate-100 cursor-pointer"
                            >
                                <FaKey className="text-indigo-500" />
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                                <FaSignOutAlt className="text-rose-500" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(card.title)}
                        className={`group ${card.cardBg} rounded-3xl border p-5 shadow-sm hover:shadow-xl ${card.glow} hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer`}
                    >
                        {/* Top Accent Line */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.topBar}`} />

                        {/* Top Row: Icon Badge */}
                        <div className="mb-3 pt-1">
                            <div
                                className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0`}
                            >
                                {card.icon}
                            </div>
                        </div>

                        {/* Bottom Row: Full Title & Big Metric Value */}
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 leading-snug">
                                {card.title}
                            </p>
                            <h2 className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                {card.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Dashboard Body: Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></span>
                            Real-Time Activity Stream
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, index) => (
                                <div key={index} className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 transition-all duration-300 border border-slate-100 hover:border-indigo-200 hover:shadow-md">
                                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">
                                            {activity.text}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                                            {formatTime(activity.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-2xl mb-3 shadow-inner">📭</div>
                                <p className="text-slate-700 font-bold text-sm">No Recent Activity</p>
                                <p className="text-xs text-slate-400 mt-1">Live actions and submissions will stream here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800">
                            Quick Administrative Actions
                        </h2>
                    </div>

                    <div className="grid gap-3.5">
                        <button
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white p-4 rounded-2xl hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 font-bold text-xs uppercase tracking-wider flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate("/admin/users")}
                        >
                            <span>Manage Registered Users</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4 rounded-2xl hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 font-bold text-xs uppercase tracking-wider flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate("/admin/interviews")}
                        >
                            <span>View Interview Sessions</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 font-bold text-xs uppercase tracking-wider flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate("/admin/coding")}
                        >
                            <span>Manage Coding Problems</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 font-bold text-xs uppercase tracking-wider flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate("/admin/analytics")}
                        >
                            <span>View Platform Analytics</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-2xl hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-bold text-xs uppercase tracking-wider flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate("/admin/achievement")}
                        >
                            <span>Manage Achievements</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Data Modal */}
            {showDataModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative border border-slate-200 overflow-hidden">
                        {/* Top Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 mt-1">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {selectedCard}
                                </h2>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                                    {modalData.length}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowDataModal(false)}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500 transition-all duration-200 cursor-pointer"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Content */}
                        {loadingModalData ? (
                            <div className="text-center py-12">
                                <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                                <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Loading {selectedCard}...
                                </p>
                            </div>
                        ) : modalData.length > 0 ? (
                            <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                                {modalData.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl transition-all duration-200 border border-slate-100"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-slate-800 text-sm truncate">
                                                {getItemTitle(item, selectedCard)}
                                            </h4>
                                            <p className="text-[11px] text-slate-400 mt-1 truncate">
                                                {getItemSubtitle(item, selectedCard)}
                                            </p>
                                        </div>

                                        <div className="ml-4 shrink-0">
                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[11px] font-semibold border border-indigo-200">
                                                {getItemStatus(item, selectedCard)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-sm font-medium">
                                No {selectedCard.toLowerCase()} found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;