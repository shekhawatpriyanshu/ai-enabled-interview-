import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import CodeEditor from "../../components/coding/CodeEditor";
import LanguageSelector from "../../components/coding/LanguageSelector";
import EditorToolbar from "../../components/coding/EditorToolbar";
import Console from "../../components/coding/Console";
import ExampleCard from "../../components/coding/ExampleCard";
import ConstraintCard from "../../components/coding/ConstraintCard";

import {
  getProblem,
  submitCode,
  runCode, // ✅ ADD THIS
} from "../../services/CodingService";

const ProblemDetails = () => {
  const { id } = useParams();

  const [expectedOutput, setExpectedOutput] = useState("");
  // ✅ SINGLE CLEAN STATE BLOCK
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [runtime, setRuntime] = useState("");
  const [memory, setMemory] = useState("");

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);

      const res = await getProblem(id);
      setProblem(res.problem);

      if (res.problem.starterCode) {
        setCode(res.problem.starterCode);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load problem."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED RUN CODE
  const handleRun = async () => {
    try {
      setOutput("Running...");
      const res = await runCode({
        problemId: id,
        code,
        language,
        input,
      });

      setOutput(res.output || "");

      setStatus(res.status);

      setRuntime(res.runtime || "");

      setMemory(res.memory || "");

      setExpectedOutput(res.expectedOutput || "");

      setScore(res.status === "Accepted" ? 100 : 0);

      if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      console.log(error.response?.data);

      setStatus("Compilation Error");

      setOutput(
          error.response?.data?.message ||
          "Server Error"
      );
      setScore(0);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await submitCode(id, {
        code,
        language,
      });

      if (!res.success) {
        setStatus(res.status || "Wrong Answer");
        setOutput(res.output || res.message || "Submission failed.");
        setExpectedOutput(res.expectedOutput || "");
        setScore(0);
        setRuntime("--");
        setMemory("--");
        toast.error(res.message || "Submission failed.");
        return;
      }

      toast.success("Code submitted successfully!");

      setStatus(res.submission.status);
      setScore(res.submission.score);

      setOutput("Submission completed successfully.");
      setRuntime(res.runtime || "--");
      setMemory(res.memory || "--");
      setExpectedOutput("");
    } catch (error) {
      console.log(error.response?.data);
      const errData = error.response?.data;
      
      setStatus(errData?.status || "Submission Error");
      setOutput(errData?.output || errData?.message || "Submission failed.");
      setExpectedOutput(errData?.expectedOutput || "");
      setScore(0);
      setRuntime("--");
      setMemory("--");

      toast.error(
        errData?.message || "Submission failed."
      );
    }
  };

  const handleReset = () => {
    setCode(problem?.starterCode || "");

    setOutput("");
    setStatus("");
    setScore(0);
    setExpectedOutput("");
    setRuntime("");
    setMemory("");

    toast.success("Editor reset.");
  };

  if (loading) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Problem...
          </h2>
        </div>
      </MainLayout>
    );
  }

  if (!problem) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl text-red-600 font-semibold">
            Problem Not Found
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-3xl font-bold">
              {problem.title}
            </h1>
            <p className="text-gray-500 mt-2">
              Topic: {problem.topic}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Problem Description
            </h2>

            <div className="whitespace-pre-line text-gray-700">
              {problem.description}
            </div>
          </div>

          {problem.examples?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Examples
              </h2>

              {problem.examples.map((example, index) => (
                <ExampleCard
                  key={index}
                  example={example}
                  index={index}
                />
              ))}
            </div>
          )}

          <ConstraintCard
            constraints={problem.constraints || []}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-5">

          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />

          <EditorToolbar
            code={code}
            language={language}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />

          <CodeEditor
            language={language}
            code={code}
            setCode={setCode}
          />

          <Console
            input={input}
            setInput={setInput}
            output={output}
            status={status}
            expectedOutput={expectedOutput}
            score={score}
            runtime={runtime}
            memory={memory}
          />

        </div>
      </div>
    </MainLayout>
  );
};

export default ProblemDetails;