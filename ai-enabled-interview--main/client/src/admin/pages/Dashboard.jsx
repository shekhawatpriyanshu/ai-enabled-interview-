import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

import {
    FaUsers,
    FaUserTie,
    FaCode,
    FaComments,
    FaChartLine,
    FaArrowUp,
} from "react-icons/fa";

import adminApi from "../services/adminApi";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInterviews: 0,
        totalCodingProblems: 0,
        totalCommunities: 0,
        activeUsers: 0,
    });

    const [loading, setLoading] =
        useState(true);

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

        return () => {
            socket.off("active_users_count");
        };
    }, []);

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <FaUsers />,
            color: "bg-blue-500",
        },
        {
            title: "Interviews",
            value: stats.totalInterviews,
            icon: <FaUserTie />,
            color: "bg-green-500",
        },
        {
            title: "Coding Problems",
            value: stats.totalCodingProblems,
            icon: <FaCode />,
            color: "bg-purple-500",
        },
        {
            title: "Total Groups ",
            value: stats.totalCommunities,
            icon: <FaComments />,
            color: "bg-orange-500",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: <FaChartLine />,
            color: "bg-red-500",
        },
    ];

    if (loading) {
        return (
            <div className="text-center py-20 text-xl">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div>

            {/* Heading */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Dashboard
                </h1>

                <p className="text-slate-500">
                    LeetChef Overview
                </p>

            </div>

            {/* Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                {cards.map((card, index) => (

                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                    >

                        <div className="flex justify-between">

                            <div>

                                <p className="text-slate-500">
                                    {card.title}
                                </p>

                                <h2 className="text-4xl font-bold mt-3">
                                    {card.value}
                                </h2>

                            </div>

                            <div
                                className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl`}
                            >
                                {card.icon}
                            </div>

                        </div>

                        <div className="flex items-center gap-2 mt-6 text-green-600">

                            <FaArrowUp />

                            <span className="font-semibold">
                                Growing
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            {/* Recent Activity */}

            <div className="grid lg:grid-cols-2 gap-8 mt-10">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Recent Activity
                    </h2>

                    <div className="space-y-4">

                        <div className="border-b pb-3">
                            🟢 New user registered
                        </div>

                        <div className="border-b pb-3">
                            🎤 Interview created
                        </div>

                        <div className="border-b pb-3">
                            💻 Coding question added
                        </div>

                        <div className="border-b pb-3">
                            👥 Community created
                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4">

                        <button className="bg-cyan-600 text-white p-4 rounded-xl hover:bg-cyan-700" onClick={() => navigate("/admin/users")}>

                            Manage Users

                        </button>

                        <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700" onClick={() => navigate("/admin/interviews")}>

                            Add Interview

                        </button>

                        <button className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700" onClick={() => navigate("/admin/coding")}>

                            Add Coding Problem

                        </button>

                        <button className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700" onClick={() => navigate("/admin/analytics")}>

                            View Analytics

                        </button>

                        <button className="bg-amber-600 text-white p-4 rounded-xl hover:bg-amber-700" onClick={() => navigate("/admin/achievement")}>

                            Manage Achievements

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;