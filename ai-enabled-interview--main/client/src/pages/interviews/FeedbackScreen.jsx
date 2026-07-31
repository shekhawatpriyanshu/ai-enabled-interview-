import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getFeedback } from "../../services/InterviewService";
import ScoreCard from "../../components/interview/ScoreCard";
import FeedbackCard from "../../components/interview/FeedbackCard";

const FeedbackScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await getFeedback(id);
      setFeedback(data.feedback);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl"
        >
          🤖
        </motion.div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-400">Feedback Not Found</h1>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 px-6 py-10 overflow-hidden relative">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 relative">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-5xl mb-6 shadow-lg shadow-cyan-500/20 border-4 border-white"
          >
            🤖
          </motion.div>

          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900 mb-3 tracking-tight">
            Interview Feedback
          </h1>

          <p className="text-cyan-700 text-lg font-bold tracking-wide uppercase">
            AI Generated Evaluation Report
          </p>
        </motion.div>

        {/* Score Cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-6 mb-12">
          <ScoreCard label="Overall Score" value={feedback.score} />
          <ScoreCard label="Communication" value={feedback.communication} />
          <ScoreCard label="Technical" value={feedback.technicalKnowledge} />
          <ScoreCard label="Problem Solving" value={feedback.problemSolving} />
        </motion.div>

        {/* Feedback Cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-12">
          <FeedbackCard title="💪 Strengths" items={feedback.strengths} />
          <FeedbackCard title="⚠️ Weaknesses" items={feedback.weaknesses} />
          <FeedbackCard title="🚀 Suggestions" items={feedback.suggestions} />
        </motion.div>
        
        {/* Action Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span>Back to Dashboard</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default FeedbackScreen;