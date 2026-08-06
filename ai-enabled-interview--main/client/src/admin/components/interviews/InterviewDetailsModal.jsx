import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Mail, Briefcase, Star, Clock, 
  CheckCircle, XCircle, AlertCircle, MessageSquare, 
  Award, Brain, Target, MessageCircle, Sparkles
} from "lucide-react";

const InterviewDetailsModal = ({ isOpen, onClose, interview, feedback }) => {
  if (!isOpen || !interview) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/90"
        >
          {/* Header Bar */}
          <div className="flex-shrink-0 px-6 sm:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 via-indigo-50/50 to-purple-50/50 relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  Interview Intelligence Report
                </h2>
                <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">
                  Comprehensive Candidate Evaluation & AI Analytics
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
            
            {/* Candidate Profile */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Candidate Profile Overview</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={<User size={18} />} label="Candidate Name" value={interview.user?.name} gradient="from-indigo-500 to-blue-600" />
                <InfoCard icon={<Mail size={18} />} label="Email Address" value={interview.user?.email} gradient="from-purple-500 to-pink-600" />
                <InfoCard icon={<Briefcase size={18} />} label="Target Role" value={interview.role} gradient="from-cyan-500 to-blue-600" />
                <InfoCard icon={<Star size={18} />} label="Experience Level" value={interview.experienceLevel} gradient="from-amber-500 to-orange-500" />
                <InfoCard icon={<Target size={18} />} label="Session Status" value={interview.status} gradient="from-emerald-500 to-teal-600" />
                <InfoCard icon={<Clock size={18} />} label="Session Date" value={new Date(interview.createdAt).toLocaleDateString()} gradient="from-fuchsia-500 to-purple-600" />
              </div>
            </section>

            {/* AI Performance Analysis Section */}
            {feedback && (
              <section className="bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">AI Performance Analytics</h3>
                </div>
                
                {/* Score Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ScoreCard title="Overall Score" score={feedback.score} icon={<Award />} gradient="from-indigo-600 via-purple-600 to-cyan-500" bgGradient="from-indigo-50/80 to-purple-50/40" />
                  <ScoreCard title="Communication" score={feedback.communication} icon={<MessageCircle />} gradient="from-cyan-600 to-blue-600" bgGradient="from-cyan-50/80 to-blue-50/40" />
                  <ScoreCard title="Technical" score={feedback.technicalKnowledge} icon={<Target />} gradient="from-emerald-600 to-teal-600" bgGradient="from-emerald-50/80 to-teal-50/40" />
                  <ScoreCard title="Problem Solving" score={feedback.problemSolving} icon={<Brain />} gradient="from-purple-600 to-fuchsia-600" bgGradient="from-purple-50/80 to-fuchsia-50/40" />
                </div>

                {/* Qualitative Feedback Cards */}
                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  <ListCard title="Key Strengths" items={feedback.strengths} type="success" />
                  <ListCard title="Areas to Improve" items={feedback.weaknesses} type="danger" />
                  <ListCard title="Actionable Advice" items={feedback.suggestions} type="warning" />
                </div>
              </section>
            )}

            {/* Questions & Transcript Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                  <MessageSquare size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Detailed Question Transcript</h3>
              </div>

              <div className="space-y-4">
                {interview.questions?.length > 0 ? (
                  interview.questions.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={index} 
                      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-md group-hover:scale-110 transition-transform">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-slate-800 text-sm leading-relaxed group-hover:text-indigo-600 transition-colors">
                          {item.question}
                        </h4>
                      </div>
                      <div className="p-5">
                        {item.answer ? (
                          <div className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-emerald-400 bg-emerald-50/30 p-3.5 rounded-r-xl border-slate-100">
                            {item.answer}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 font-normal italic flex items-center gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                            <AlertCircle size={15} className="text-amber-500" />
                            Candidate did not provide a recorded answer for this question.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium text-xs">
                    No transcript available for this interview session.
                  </div>
                )}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const InfoCard = ({ label, value, icon, gradient }) => {
  return (
    <div className="flex items-center gap-3.5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-purple-300 transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-xs sm:text-sm text-slate-700 truncate mt-0.5" title={value || "-"}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, icon, gradient, bgGradient }) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group`}>
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transition-transform group-hover:scale-125`} />
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h4>
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 relative z-10">
        <h2 className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {score ?? 0}
        </h2>
        <span className="text-xs font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

const ListCard = ({ title, items, type }) => {
  const styles = {
    success: {
      icon: <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />,
      bg: "bg-emerald-50/70 border-emerald-200/90",
      title: "text-emerald-800"
    },
    danger: {
      icon: <XCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />,
      bg: "bg-rose-50/70 border-rose-200/90",
      title: "text-rose-800"
    },
    warning: {
      icon: <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />,
      bg: "bg-amber-50/70 border-amber-200/90",
      title: "text-amber-800"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 ${currentStyle.bg}`}>
      <h4 className={`font-bold uppercase tracking-wider text-xs mb-3 ${currentStyle.title}`}>
        {title}
      </h4>
      {items?.length > 0 ? (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-slate-700 text-xs font-normal leading-relaxed">
              {currentStyle.icon}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 italic text-xs font-normal">
          No records.
        </p>
      )}
    </div>
  );
};

export default InterviewDetailsModal;