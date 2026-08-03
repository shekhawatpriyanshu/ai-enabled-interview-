import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  Tag,
  Calendar,
  Code,
  FileText,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

import MainLayout from "../../layouts/MainLayout";
import { getQuestion } from "../../services/QuestionService";
import DifficultyBadge from "../../components/QuestionBank/DifficultyBadge";
import LoadingSkeleton from "../../components/QuestionBank/LoadingSkeleton";
import EmptyState from "../../components/QuestionBank/EmptyState";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await getQuestion(id);
      setQuestion(res.question);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6">
        <EmptyState
          title="Question Not Found"
          description="The requested question does not exist."
        />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <MainLayout>
      <motion.div 
        className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <Link
            to="/question-bank/questions"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft size={18} />
            Back to Questions
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {question.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
              <DifficultyBadge difficulty={question.difficulty} />

              {question.topic?.name && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                  <BookOpen size={16} />
                  <span>{question.topic.name}</span>
                </div>
              )}

              {question.company?.name && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800">
                  <Building2 size={16} />
                  <span>{question.company.name}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-blue-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Problem Description
                </h2>
              </div>
              
              <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                {question.description ? (
                  <p className="whitespace-pre-wrap">{question.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available.</p>
                )}
              </div>
            </motion.div>

            {/* Answer / Solution */}
            {question.answer && (
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Solution Guide
                  </h2>
                </div>
                
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-inner overflow-x-auto">
                  <pre className="text-emerald-400 font-mono text-sm leading-7 whitespace-pre-wrap">
                    <code>{question.answer}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Detailed Spec / Code Outline (if exists) */}
            {question.question && (
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-md border border-indigo-100 dark:border-indigo-800/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="text-indigo-600 dark:text-indigo-400" size={20} />
                  <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">
                    Specification
                  </h2>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4 text-sm font-mono text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap border border-indigo-200/50 dark:border-indigo-800/50">
                  {question.question}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="text-purple-500" size={20} />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Related Tags
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {question.tags?.length > 0 ? (
                  question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-default border border-gray-200 dark:border-gray-700"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No tags available.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Meta Info */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Added to Bank</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(question.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default QuestionDetails;