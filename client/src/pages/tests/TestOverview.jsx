import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaClock,
  FaLayerGroup,
  FaArrowLeft,
  FaPlay,
  FaClipboardList,
  FaShieldAlt,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getTest } from "../../services/TestService";

const TestOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestDetails();
  }, []);

  const loadTestDetails = async () => {
    try {
      setLoading(true);
      const res = await getTest(id);
      setTest(res.test);
    } catch (error) {
      toast.error("Failed to load test details");
      navigate("/tests");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!test) {
    return (
      <MainLayout showNavbar={false}>
        <div className="text-center p-12">Test not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Link */}
        <Link
          to="/tests"
          className="flex items-center text-slate-500 hover:text-slate-800 transition mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Mock Tests
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-8">
            <h1 className="text-3xl font-bold">{test.title}</h1>
            <p className="mt-2 text-cyan-100">{test.description}</p>
          </div>

          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
                  <FaLayerGroup className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">Questions</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {test.questions?.length || 0} MCQ Items
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">Duration</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {test.duration} Minutes
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
                  <FaClipboardList className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">Difficulty</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {test.difficulty}
                  </h3>
                </div>
              </div>
            </div>

            {/* Test Rules */}
            <div className="border-t border-slate-100 pt-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-cyan-600" /> Instructions & Rules
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>This assessment consists of multiple-choice questions. Only one option is correct.</li>
                <li>The timer will start automatically once you click the <strong>Start Assessment</strong> button below.</li>
                <li>Do not refresh or leave the page. Doing so may submit the test automatically or reset your answers.</li>
                <li>Ensure you have a stable internet connection.</li>
                <li>Your submission history and score will be logged immediately on the Submissions page upon completion.</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate(`/tests/${test._id}/attempt`)}
                className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-10 py-4 rounded-2xl hover:scale-[1.03] transition shadow-lg text-lg"
              >
                <FaPlay /> Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestOverview;
