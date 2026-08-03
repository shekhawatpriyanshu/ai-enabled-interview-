import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Mail, Briefcase, Star, Clock, 
  CheckCircle, XCircle, AlertCircle, MessageSquare, 
  Award, Brain, Target, MessageCircle 
} from "lucide-react";

const InterviewDetailsModal = ({ isOpen, onClose, interview, feedback }) => {
  if (!isOpen || !interview) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Interview Intelligence Report
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                Comprehensive candidate evaluation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-10">
            
            {/* Candidate Information */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Candidate Profile</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={<User size={18} />} label="Name" value={interview.user?.name} />
                <InfoCard icon={<Mail size={18} />} label="Email" value={interview.user?.email} />
                <InfoCard icon={<Briefcase size={18} />} label="Role" value={interview.role} />
                <InfoCard icon={<Star size={18} />} label="Experience" value={interview.experienceLevel} />
                <InfoCard icon={<Target size={18} />} label="Status" value={interview.status} />
                <InfoCard icon={<Clock size={18} />} label="Date" value={new Date(interview.createdAt).toLocaleDateString()} />
              </div>
            </section>

            {/* AI Feedback Section */}
            {feedback && (
              <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="text-indigo-500" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI Performance Analysis</h3>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <ScoreCard title="Overall Score" score={feedback.score} icon={<Award />} color="indigo" />
                  <ScoreCard title="Communication" score={feedback.communication} icon={<MessageCircle />} color="blue" />
                  <ScoreCard title="Technical" score={feedback.technicalKnowledge} icon={<Target />} color="emerald" />
                  <ScoreCard title="Problem Solving" score={feedback.problemSolving} icon={<Brain />} color="violet" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <ListCard title="Key Strengths" items={feedback.strengths} type="success" />
                  <ListCard title="Areas to Improve" items={feedback.weaknesses} type="danger" />
                  <ListCard title="Actionable Advice" items={feedback.suggestions} type="warning" />
                </div>
              </section>
            )}

            {/* Questions */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-emerald-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Detailed Transcript</h3>
              </div>
              <div className="space-y-4">
                {interview.questions?.length > 0 ? (
                  interview.questions.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={index} 
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                    >
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-start gap-3">
                          <span className="flex-shrink-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{item.question}</span>
                        </h4>
                      </div>
                      <div className="p-4 sm:p-5">
                        {item.answer ? (
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap pl-9 border-l-2 border-emerald-100 dark:border-emerald-900/30">
                            {item.answer}
                          </div>
                        ) : (
                          <div className="pl-9 text-gray-400 italic flex items-center gap-2">
                            <AlertCircle size={16} />
                            Candidate did not provide an answer.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
                    No transcript available for this interview.
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

const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-blue-500 flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white truncate mt-0.5" title={value || "-"}>
        {value || "-"}
      </p>
    </div>
  </div>
);

const ScoreCard = ({ title, score, icon, color }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-blue-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    blue: "from-blue-400 to-cyan-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    emerald: "from-emerald-400 to-green-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    violet: "from-violet-500 to-purple-600 text-violet-600 bg-violet-50 dark:bg-violet-900/20"
  };
  
  const bgColors = colorMap[color] || colorMap.indigo;
  const gradient = bgColors.split(' text-')[0];
  const textColor = `text-${bgColors.split(' text-')[1].split(' ')[0]}`;
  const bgColorClass = bgColors.split(' bg-')[1];
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h4>
        <div className={`p-2 rounded-lg bg-${bgColorClass} ${textColor}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 relative z-10">
        <h2 className={`text-4xl font-extrabold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
          {score ?? 0}
        </h2>
        <span className="text-sm font-medium text-gray-400">/ 100</span>
      </div>
    </div>
  );
};

const ListCard = ({ title, items, type }) => {
  const styles = {
    success: {
      icon: <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />,
      bg: "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30",
      title: "text-emerald-700 dark:text-emerald-400"
    },
    danger: {
      icon: <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />,
      bg: "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30",
      title: "text-red-700 dark:text-red-400"
    },
    warning: {
      icon: <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />,
      bg: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30",
      title: "text-amber-700 dark:text-amber-400"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-xl p-5 border ${currentStyle.bg}`}>
      <h4 className={`font-semibold mb-4 text-lg ${currentStyle.title}`}>
        {title}
      </h4>
      {items?.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {currentStyle.icon}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">
          No items recorded.
        </p>
      )}
    </div>
  );
};

export default InterviewDetailsModal;