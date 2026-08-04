import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import InterviewForm from "../../components/interview/InterviewForm";

import {
  startInterview,
} from "../../services/InterviewService";

const StartInterview = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleStartInterview =
    async (formData) => {
      try {
        setLoading(true);

        const response =
          await startInterview(
            formData
          );

        if (
          response.success
        ) {
          navigate(
            `/interviews/${response.interview._id}`
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          error?.response?.data
            ?.message ||
          "Failed to start interview"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex items-center justify-center px-6">

        <div className="w-full max-w-4xl">

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 md:p-14">

            <div className="text-center mb-10">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-6xl mb-6 shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-[pulse_3s_ease-in-out_infinite] hover:scale-110 transition-transform duration-300 cursor-default">
                🤖
              </div>

              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-4 tracking-tight">
                Mock Interview
              </h1>

              <p className="text-slate-300 text-lg mb-2 max-w-xl mx-auto font-medium">
                Customize your interview settings and prepare to be challenged by our advanced AI interviewer.
              </p>
            </div>

            <InterviewForm
              onSubmit={
                handleStartInterview
              }
              loading={loading}
            />

            <div className="mt-10 border-t border-white/10 pt-6">

              <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white/5 rounded-xl p-5 text-center">
                  <h3 className="text-cyan-400 font-bold text-lg">
                    🎯 Role Based
                  </h3>

                  <p className="text-slate-300 mt-2 text-sm">
                    Questions tailored specifically to your selected role.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-5 text-center">
                  <h3 className="text-purple-400 font-bold text-lg">
                    🧠 AI Evaluation
                  </h3>

                  <p className="text-slate-300 mt-2 text-sm">
                    Receive instant feedback and performance analysis.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-5 text-center">
                  <h3 className="text-green-400 font-bold text-lg">
                    📈 Detailed Reports
                  </h3>

                  <p className="text-slate-300 mt-2 text-sm">
                    Track strengths, weaknesses, and improvement areas.
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