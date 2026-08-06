import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";

const MockTestStats = ({ tests = [] }) => {
  const total = tests.length;
  const active = tests.filter((t) => t.isActive).length;
  const inactive = total - active;
  const totalQuestions = tests.reduce(
    (acc, curr) => acc + (curr.questions?.length || 0),
    0
  );

  const cards = [
    {
      title: "Total Mock Tests",
      value: total,
      icon: <FaClipboardList />,
      gradient: "from-indigo-600 to-blue-600",
      cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 border-indigo-200/90",
      topBar: "from-indigo-500 via-blue-500 to-cyan-400",
      iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/30",
      glow: "hover:shadow-indigo-500/20",
    },
    {
      title: "Active Tests",
      value: active,
      icon: <FaCheckCircle />,
      gradient: "from-emerald-600 to-teal-600",
      cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-200/90",
      topBar: "from-emerald-500 via-teal-500 to-cyan-400",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30",
      glow: "hover:shadow-emerald-500/20",
    },
    {
      title: "Inactive Tests",
      value: inactive,
      icon: <FaExclamationCircle />,
      gradient: "from-rose-600 to-pink-600",
      cardBg: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/40 border-rose-200/90",
      topBar: "from-rose-500 via-pink-500 to-red-400",
      iconBg: "bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-rose-500/30",
      glow: "hover:shadow-rose-500/20",
    },
    {
      title: "Total Questions",
      value: totalQuestions,
      icon: <FaQuestionCircle />,
      gradient: "from-purple-600 to-fuchsia-600",
      cardBg: "bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/40 border-purple-200/90",
      topBar: "from-purple-500 via-fuchsia-500 to-pink-400",
      iconBg: "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-purple-500/30",
      glow: "hover:shadow-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`group ${card.cardBg} rounded-3xl border p-5 sm:p-6 shadow-sm hover:shadow-xl hover:scale-[1.03] ${card.glow} hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
        >
          {/* Top Accent Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.topBar}`} />

          {/* Top Row: Icon Box */}
          <div className="mb-3 pt-1">
            <div
              className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0`}
            >
              {card.icon}
            </div>
          </div>

          {/* Bottom Row: Title & Big Value */}
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
  );
};

export default MockTestStats;