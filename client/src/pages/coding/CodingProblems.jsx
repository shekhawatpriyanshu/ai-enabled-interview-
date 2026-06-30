import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  Sparkles,
  Code2,
  BrainCircuit,
  Building2,
  Cpu,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { generateProblem } from "../../services/CodingService";

const topics = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "HashMap",
  "Tree",
  "Binary Search Tree",
  "Heap",
  "Graph",
  "Dynamic Programming",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Sorting",
  "Searching",
];

const companies = [
  "",
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Adobe",
  "Flipkart",
  "Infosys",
  "TCS",
  "Wipro",
];

const CodingProblems = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("javascript");
  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const res = await generateProblem({
        topic,
        difficulty,
        language,
        company,
      });

      toast.success("Problem Generated Successfully!");

      navigate(`/coding/${res.problem._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate problem."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-indigo-50 py-10 px-4">

        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-5 py-2 rounded-full mb-5">
            <Sparkles size={18} />
            AI Powered Coding Interview Platform
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900">
            Generate Coding Problems
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
            Practice AI-generated interview questions tailored
            to your preferred topic, difficulty level,
            programming language, and target company.
          </p>

        </div>

        {/* Main Card */}

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 p-10">

          <div className="grid md:grid-cols-2 gap-8">

            {/* Topic */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">
                <Code2 size={18} />
                Topic
              </label>

              <select
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {topics.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* Difficulty */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">
                <BrainCircuit size={18} />
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

            </div>

            {/* Language */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">
                <Cpu size={18} />
                Programming Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="javascript">
                  JavaScript
                </option>

                <option value="java">
                  Java
                </option>

                <option value="python">
                  Python
                </option>

                <option value="cpp">
                  C++
                </option>

              </select>

            </div>

            {/* Company */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">
                <Building2 size={18} />
                Company
              </label>

              <select
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {companies.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item || "General"}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Generate Button */}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-10 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:scale-[1.02] hover:shadow-cyan-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-3">
                <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating AI Problem...
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3">
                <Sparkles size={22} />
                Generate AI Coding Problem
              </div>
            )}
          </button>

        </div>

        {/* Bottom Features */}

        <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Code2 className="mx-auto text-cyan-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">
              AI Generated Problems
            </h3>
            <p className="text-gray-500 mt-2">
              Fresh interview questions every time.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <BrainCircuit className="mx-auto text-indigo-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">
              Company Specific
            </h3>
            <p className="text-gray-500 mt-2">
              Practice questions inspired by top tech companies.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Cpu className="mx-auto text-green-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">
              Multi Language
            </h3>
            <p className="text-gray-500 mt-2">
              Solve problems in Java, JavaScript, Python, or C++.
            </p>
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default CodingProblems;