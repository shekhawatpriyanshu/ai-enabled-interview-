import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import InterviewForm from "../../components/interview/InterviewForm";

import {
  startInterview,
} from "../../services/InterviewService";

const StartInterview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async (formData) => {
    try {
      setLoading(true);

      const response = await startInterview(formData);

      if (response.success) {
        navigate(`/interviews/${response.interview._id}`);
      }
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
        "Failed to start interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="relative min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="relative z-10 w-full max-w-4xl my-8">
          {/* Main Card Container */}
          <div className="relative bg-white border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 transition-all duration-500 overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

            {/* Header Content */}
            <div className="text-center mb-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                AI Interview Assistant v2.0
              </div>

              {/* Bot Avatar Icon */}
              <div className="relative group w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 cursor-pointer">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 blur-lg opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 flex items-center justify-center text-5xl sm:text-6xl shadow-md transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                  🤖
                </div>
              </div>

              {/* Gradient Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Launch Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">
                  Mock Interview
                </span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-semibold leading-relaxed">
                Select your target tech stack and experience level. Our AI interviewer will formulate realistic questions and evaluate your responses in real time.
              </p>
            </div>

            {/* Interactive Form */}
            <InterviewForm
              onSubmit={handleStartInterview}
              loading={loading}
            />

            {/* Bottom Feature Cards */}
            <div className="mt-12 border-t border-slate-100 pt-8">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="group bg-slate-50/80 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">🎯</div>
                  <h3 className="text-indigo-700 font-bold text-sm">Role Based</h3>
                  <p className="text-slate-500 mt-1 text-xs font-semibold leading-normal">
                    Questions customized specifically to your chosen tech stack.
                  </p>
                </div>

                <div className="group bg-slate-50/80 hover:bg-purple-50/40 border border-slate-200/80 hover:border-purple-300 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">🧠</div>
                  <h3 className="text-purple-700 font-bold text-sm">AI Evaluation</h3>
                  <p className="text-slate-500 mt-1 text-xs font-semibold leading-normal">
                    Get real-time grading, feedback, and optimization suggestions.
                  </p>
                </div>

                <div className="group bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">📈</div>
                  <h3 className="text-emerald-700 font-bold text-sm">Detailed Analytics</h3>
                  <p className="text-slate-500 mt-1 text-xs font-semibold leading-normal">
                    Track performance metrics, confidence score, and answer depth.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StartInterview;