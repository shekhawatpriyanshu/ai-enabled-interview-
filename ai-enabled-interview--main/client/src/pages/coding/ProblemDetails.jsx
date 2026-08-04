import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaPlay, FaCloudUploadAlt, FaCode, FaChevronLeft, FaRedo } from "react-icons/fa";

import CodeEditor from "../../components/coding/CodeEditor";
import { getProblem, submitCode, runCode } from "../../services/CodingService";

const defaultBoilerplate = {
  javascript: `// Write your JavaScript code here\n\nfunction solve() {\n  \n}\n`,
  python: `# Write your Python code here\n\ndef solve():\n    pass\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}\n`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n        \n    }\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}\n`
};

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [runtime, setRuntime] = useState("");
  const [memory, setMemory] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  
  const [evaluating, setEvaluating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("description"); // "description"
  const [consoleTab, setConsoleTab] = useState("testcases"); // "testcases" or "result"

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const res = await getProblem(id);
      setProblem(res.problem);
      const defaultLang = res.problem.supportedLanguages?.[0] || "javascript";
      setLanguage(defaultLang);
      const savedCode = res.problem.starterCode?.[defaultLang];
      setCode(savedCode || defaultBoilerplate[defaultLang] || "");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load problem.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problem) {
      const savedCode = problem.starterCode?.[language];
      setCode(savedCode || defaultBoilerplate[language] || "");
    }
  }, [language, problem]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleRun = async () => {
    try {
      setEvaluating(true);
      setConsoleTab("result");
      const res = await runCode({ problemId: id, code, language });
      setOutput(res.output || "");
      setStatus(res.status);
      setRuntime(res.runtime || "");
      setMemory(res.memory || "");
      setExpectedOutput(res.expectedOutput || "");
      setScore(res.status === "Accepted" ? 100 : 0);
      if (res.error) toast.error(res.error);
    } catch (error) {
      setStatus("Compilation Error");
      setOutput(error.response?.data?.message || "Server Error");
      setScore(0);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setConsoleTab("result");
      const res = await submitCode(id, { code, language });
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
      setStatus(res.submission?.status || "Accepted");
      setScore(res.submission?.score || 100);
      setOutput("Submission completed successfully.");
      setRuntime(res.runtime || "--");
      setMemory(res.memory || "--");
      setExpectedOutput("");
    } catch (error) {
      const errData = error.response?.data;
      setStatus(errData?.status || "Submission Error");
      setOutput(errData?.output || errData?.message || "Submission failed.");
      setExpectedOutput(errData?.expectedOutput || "");
      setScore(0);
      setRuntime("--");
      setMemory("--");
      toast.error(errData?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(problem?.starterCode?.[language] || defaultBoilerplate[language] || "");
    setOutput("");
    setStatus("");
    setScore(0);
    setExpectedOutput("");
    setRuntime("");
    setMemory("");
    setConsoleTab("testcases");
    toast.success("Editor reset.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1a1a] text-cyan-500">
        <h2 className="text-xl font-semibold animate-pulse">Loading Problem...</h2>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1a1a] text-red-500">
        <h2 className="text-2xl font-semibold">Problem Not Found</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a1a1a] text-slate-300 font-sans">
      {/* Navbar */}
      <div className="h-14 bg-[#282828] border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/coding')} className="text-slate-400 hover:text-white transition">
            <FaChevronLeft className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <FaCode className="text-cyan-500 text-xl" />
            <span className="font-semibold text-white truncate max-w-[300px]">{problem.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRun}
            disabled={evaluating || submitting}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <FaPlay className="text-green-400 text-xs" />
            {evaluating ? "Running..." : "Run"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={evaluating || submitting}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <FaCloudUploadAlt className="text-lg" />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left Pane: Problem Description */}
        <div className="w-1/2 flex flex-col bg-[#282828] rounded-xl border border-slate-700 overflow-hidden">
          <div className="flex bg-[#333333] px-2 pt-2 gap-1 border-b border-slate-700">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${activeTab === 'description' ? 'bg-[#282828] text-white' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'description' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' : problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
                    {problem.difficulty || 'Medium'}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mb-6">Topic: {problem.topic}</div>
                <div className="mb-6 whitespace-pre-wrap leading-relaxed text-sm">
                  {problem.description}
                </div>
                
                <div className="mt-8">
                  {problem.examples?.map((tc, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="text-white font-semibold mb-2">Example {idx + 1}:</h3>
                      <div className="bg-[#1e1e1e] p-4 rounded-lg border-l-4 border-cyan-500 font-mono text-sm shadow-inner">
                        <div className="mb-2"><span className="text-slate-500 select-none">Input: </span><span className="text-slate-300">{tc.input}</span></div>
                        <div className="mb-2"><span className="text-slate-500 select-none">Output: </span><span className="text-slate-300">{tc.output}</span></div>
                        {tc.explanation && (<div><span className="text-slate-500 select-none">Explanation: </span><span className="text-slate-300">{tc.explanation}</span></div>)}
                      </div>
                    </div>
                  ))}
                </div>

                {problem.constraints?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-white font-semibold mb-2">Constraints:</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code className="bg-[#1e1e1e] px-1 py-0.5 rounded text-slate-300">{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Pane: Editor & Console */}
        <div className="w-1/2 flex flex-col gap-2 overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-[#282828] rounded-xl border border-slate-700 overflow-hidden min-h-[50%]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#333333] border-b border-slate-700">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-[#333333] text-slate-200 text-xs font-medium px-2 py-1 outline-none cursor-pointer hover:bg-slate-700 rounded transition"
              >
                {problem.supportedLanguages?.map(lang => (
                   <option key={lang} value={lang}>{lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                ))}
                {(!problem.supportedLanguages || problem.supportedLanguages.length === 0) && (
                   <>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                   </>
                )}
              </select>
              <div className="text-slate-400 text-xs flex gap-2">
                 <button onClick={handleReset} className="hover:text-white transition flex items-center gap-1" title="Reset to default code"><FaRedo/></button>
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e]">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
              />
            </div>
          </div>

          {/* Console Area */}
          <div className="h-64 flex flex-col bg-[#282828] rounded-xl border border-slate-700 overflow-hidden shrink-0">
            <div className="flex bg-[#333333] px-2 pt-2 gap-1 border-b border-slate-700">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-2 ${consoleTab === 'testcases' ? 'bg-[#282828] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setConsoleTab('testcases')}
              >
                Testcases
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-2 ${consoleTab === 'result' ? 'bg-[#282828] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setConsoleTab('result')}
              >
                Test Result
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {consoleTab === 'testcases' && (
                <div className="flex flex-col gap-4">
                  {problem.examples?.map((tc, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">{idx+1}</div>
                      <div className="flex-1 bg-[#1e1e1e] p-3 rounded-lg border border-slate-700 font-mono text-sm">
                        <div className="mb-1 text-slate-500">Input</div>
                        <div className="text-slate-200 mb-2">{tc.input}</div>
                        <div className="mb-1 text-slate-500">Expected Output</div>
                        <div className="text-slate-200">{tc.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {consoleTab === 'result' && (
                <div className="flex flex-col h-full">
                  {evaluating || submitting ? (
                    <div className="m-auto text-slate-400 flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                      {evaluating ? "Evaluating..." : "Submitting..."}
                    </div>
                  ) : status ? (
                    <div>
                      <h2 className={`text-xl font-bold mb-4 ${status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                        {status}
                      </h2>
                      {runtime && runtime !== '--' && (
                        <div className="flex gap-4 text-sm text-slate-400 mb-4 font-mono">
                          <div>Runtime: <span className="text-slate-200">{runtime}</span></div>
                          <div>Memory: <span className="text-slate-200">{memory}</span></div>
                        </div>
                      )}
                      
                      {output && status !== 'Accepted' && (
                        <div className="mb-4">
                          <div className="text-slate-500 mb-1 text-sm">Output</div>
                          <div className="bg-[#1e1e1e] p-4 rounded-lg border border-red-900/50 text-red-400 font-mono text-sm whitespace-pre-wrap">
                            {output}
                          </div>
                        </div>
                      )}

                      {expectedOutput && status !== 'Accepted' && (
                         <div className="mb-4">
                          <div className="text-slate-500 mb-1 text-sm">Expected Output</div>
                          <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-700 text-green-400 font-mono text-sm whitespace-pre-wrap">
                            {expectedOutput}
                          </div>
                        </div>
                      )}

                      {status === 'Accepted' && (
                        <div className="text-slate-300">
                          {score > 0 && <p>Score: <span className="font-mono text-cyan-400">{score}/100</span></p>}
                          <p className="mt-2 text-sm text-slate-500">All sample test cases passed!</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="m-auto text-slate-500 text-sm">
                      Run your code to see results here.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;