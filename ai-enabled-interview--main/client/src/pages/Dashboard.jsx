import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getMyAnalytics, getMyRewards } from "../services/AnalyticsService";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserTie,
  FaCode,
  FaTrophy,
  FaFire,
  FaMicrophone,
  FaFileAlt,
  FaClipboardList,
  FaArrowRight,
  FaRocket,
  FaChartLine,
  FaBolt,
  FaGraduationCap,
} from "react-icons/fa";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, rewardsRes] = await Promise.all([
          getMyAnalytics(),
          getMyRewards(),
        ]);
        if (analyticsRes.success) {
          setAnalytics(analyticsRes.analytics);
        }
        if (rewardsRes.success) {
          setRewards(rewardsRes.rewards);
        }
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout showNavbar={true}>
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Dashboard Stats...
          </p>
        </div>
      </MainLayout>
    );
  }

  const totalInterviews = analytics?.interviewsCompleted || 0;
  const questionsSolved = analytics?.codingSolved !== undefined ? analytics.codingSolved : (analytics?.questionsSolved || 0);
  const achievementsCount = rewards.filter((r) => r.achievement).length;
  const totalScore = analytics?.totalScore || 0;

  const statCards = [
    {
      title: "TOTAL INTERVIEWS",
      value: totalInterviews,
      subtitle: "Completed AI sessions",
      icon: <FaUserTie className="text-xl text-white" />,
      topBorder: "border-t-4 border-cyan-400",
      cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border-indigo-200/80",
      valueColor: "text-indigo-600",
      iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 shadow-indigo-500/25",
    },
    {
      title: "CODING PROBLEMS SOLVED",
      value: questionsSolved,
      subtitle: "Questions completed",
      icon: <FaCode className="text-xl text-white" />,
      topBorder: "border-t-4 border-purple-500",
      cardBg: "bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/40 border-purple-200/80",
      valueColor: "text-purple-600",
      iconBg: "bg-gradient-to-tr from-purple-600 to-fuchsia-600 shadow-purple-500/25",
    },
    {
      title: "ACHIEVEMENTS",
      value: achievementsCount,
      subtitle: "Unlocked badges & awards",
      icon: <FaTrophy className="text-xl text-white" />,
      topBorder: "border-t-4 border-emerald-400",
      cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/80",
      valueColor: "text-emerald-600",
      iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/25",
    },
    {
      title: "TOTAL SCORE",
      value: totalScore,
      subtitle: "Earned performance points",
      icon: <FaFire className="text-xl text-white" />,
      topBorder: "border-t-4 border-amber-500",
      cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-200/80",
      valueColor: "text-amber-600",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/25",
    },
  ];

  const quickActions = [
    {
      title: "Start AI Interview",
      desc: "Simulate live technical & HR mock interviews with real-time feedback",
      icon: <FaMicrophone className="text-2xl text-emerald-600" />,
      cardBg: "bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border-emerald-200/80 hover:border-emerald-400",
      iconBg: "bg-emerald-100 border-emerald-200",
      link: "/interviews/start",
      badge: "AI Powered",
      badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    {
      title: "Solve Coding Problems",
      desc: "Practice Data Structures & Algorithms with instant code evaluation",
      icon: <FaCode className="text-2xl text-purple-600" />,
      cardBg: "bg-gradient-to-br from-purple-50/70 via-white to-fuchsia-50/40 border-purple-200/80 hover:border-purple-400",
      iconBg: "bg-purple-100 border-purple-200",
      link: "/coding",
      badge: "Practice",
      badgeBg: "bg-purple-100 text-purple-700 border-purple-300",
    },
    {
      title: "Resume Analyzer",
      desc: "Upload your CV and get instant ATS score optimization recommendations",
      icon: <FaFileAlt className="text-2xl text-cyan-600" />,
      cardBg: "bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40 border-cyan-200/80 hover:border-cyan-400",
      iconBg: "bg-cyan-100 border-cyan-200",
      link: "/resume-analyzer",
      badge: "ATS Check",
      badgeBg: "bg-cyan-100 text-cyan-700 border-cyan-300",
    },
    {
      title: "Take Mock Tests",
      desc: "Timed full-length technical assessments designed for top tech roles",
      icon: <FaClipboardList className="text-2xl text-amber-600" />,
      cardBg: "bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border-amber-200/80 hover:border-amber-400",
      iconBg: "bg-amber-100 border-amber-200",
      link: "/tests",
      badge: "Assessment",
      badgeBg: "bg-amber-100 text-amber-700 border-amber-300",
    },
  ];

  return (
    <MainLayout showNavbar={true}>
      <div className="space-y-8 pb-8 bg-slate-50 text-slate-800">
        {/* Welcome Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 border border-indigo-200/80 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden"
        >
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <FaRocket className="text-indigo-600 text-xs animate-bounce" />
                <span>AI Interview Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  User Dashboard
                </span>
                <span>🚀</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                Real-time AI Interview Intelligence & Platform Analytics
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`group ${stat.cardBg} ${stat.topBorder} rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>

              <div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {stat.title}
                </h3>
                <p className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${stat.valueColor}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Action Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FaChartLine className="text-indigo-600 text-base" />
              <span>Quick Actions & Practice</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={action.link}
                  className={`group block ${action.cardBg} rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl border ${action.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                        {action.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {action.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${action.badgeBg}`}>
                            {action.badge}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                          {action.desc}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shrink-0 transition-all duration-300 mt-1 shadow-xs">
                      <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform Level Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border border-indigo-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
              <FaGraduationCap className="text-3xl" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Student Mastery Track</h3>
              <p className="text-xs font-medium text-slate-600 mt-1 max-w-md">
                Consistently practice mock interviews and coding problems to earn badges and boost your hireability score.
              </p>
            </div>
          </div>

          <Link
            to="/analytics"
            className="px-5 py-3 rounded-xl bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs border border-indigo-200 hover:border-indigo-600 shadow-xs hover:shadow-md transition-all duration-200 shrink-0"
          >
            View Full Analytics →
          </Link>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;