import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaPlay, FaCloudUploadAlt, FaCode, FaChevronLeft, FaRedo } from "react-icons/fa";
import { FiMaximize, FiMinimize } from "react-icons/fi";

import CodeEditor from "../../components/coding/CodeEditor";
import { getProblem, submitCode, runCode } from "../../services/CodingService";

const defaultBoilerplate = {
  javascript: `// Write your JavaScript code here\n\nfunction solve() {\n  \n}\n`,
  python: `# Write your Python code here\n\ndef solve():\n    pass\n`,
  cpp: `class Solution {\npublic:\n    int solve() {\n        // Write your C++ code here\n        return 0;\n    }\n};`,
  java: `class Solution {\n    public int solve() {\n        // Write your Java code here\n        return 0;\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}\n`
};

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [editorTheme, setEditorTheme] = useState("vs-dark");

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

  const [selectedCase, setSelectedCase] = useState(0);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const getTemplate = (lang) => {
    const saved = localStorage.getItem(`draft_${id}_${lang}`);
    if (saved) return saved;
    return problem?.starterCode?.[lang] || defaultBoilerplate[lang] || "";
  };

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
      setCode(getTemplate(language));
    }
  }, [language, problem]);

  useEffect(() => {
    if (code && problem) {
      localStorage.setItem(`draft_${id}_${language}`, code);
    }
  }, [code, language, id, problem]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const editorMount = (editor, monaco) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        localStorage.setItem(`draft_${id}_${language}`, editor.getValue());
        toast.success("Code saved to draft!");
      }
    );
  };

  const handleRun = async () => {
    try {
      setEvaluating(true);
      setConsoleTab("result");

      const executeInput = isCustomInput
        ? customInput
        : (problem?.examples?.[selectedCase]?.input || problem?.testCases?.[selectedCase]?.input || []);

      const res = await runCode({
        problemId: id,
        language,
        code,
        input: executeInput
      });

      if (res.error) {
        setOutput(res.error);
      } else {
        setOutput(res.output);
      }
      setStatus(res.status || "Unknown");
      setRuntime(res.runtime || "--");
      setMemory(res.memory || "--");
      setExpectedOutput(res.expectedOutput || "");
      setScore(res.status === "Accepted" ? 100 : 0);
    } catch (error) {
      console.log(error);
      setOutput("Run failed");
      setStatus("Error");
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setConsoleTab("result");
      const res = await submitCode({ problemId: id, code, language });

      const submissionStatus = res.status || (res.passed ? "Accepted" : "Wrong Answer");
      const isPassed = res.passed === true || submissionStatus === "Accepted";

      setStatus(submissionStatus);
      setRuntime(res.runtime || "--");
      setMemory(res.memory || "--");

      if (isPassed) {
        toast.success("All test cases passed!");
        setScore(100);
        setOutput("All test cases passed successfully!");
        setExpectedOutput("");
      } else {
        const testCases = res.testCases || [];
        const passedCount = testCases.filter(t => t.status === "SUCCESS").length;
        const totalCount = testCases.length;

        const normalizeStr = (s) => String(s || "").trim().replace(/\s+/g, '').replace(/'/g, '"');
        const failedCase = testCases.find(t => 
          t.status !== "SUCCESS" || 
          (t.actual !== null && t.expected !== null && normalizeStr(t.actual) !== normalizeStr(t.expected))
        ) || testCases.find(t => t.status !== "SUCCESS") || testCases[0];

        let outputMsg = totalCount > 0 ? `${passedCount}/${totalCount} test cases passed.` : (res.message || "Evaluation completed.");
        if (failedCase && failedCase.actual !== null && failedCase.actual !== undefined) {
          outputMsg += `\n\n[Failing Test Case Output]:\n${failedCase.actual}`;
        } else if (res.output) {
          outputMsg += `\n\n${res.output}`;
        }

        setOutput(outputMsg);
        setExpectedOutput(failedCase?.expected !== null && failedCase?.expected !== undefined
          ? (typeof failedCase.expected === "object" ? JSON.stringify(failedCase.expected) : String(failedCase.expected))
          : "");
        setScore(totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0);
        toast.error(`${submissionStatus}: ${passedCount}/${totalCount} test cases passed.`);
      }
    } catch (error) {
      const errData = error.response?.data;
      const actualStatus = errData?.status || "Evaluation Failed";
      const actualMessage = errData?.output || errData?.message || error.message || "Could not evaluate code. Please check your syntax.";
      setStatus(actualStatus);
      setOutput(actualMessage);
      setExpectedOutput(errData?.expectedOutput || "");
      setScore(0);
      setRuntime("--");
      setMemory("--");
      toast.error(actualMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    const defaultCode = problem?.starterCode?.[language] || defaultBoilerplate[language] || "";
    setCode(defaultCode);
    localStorage.setItem(`draft_${id}_${language}`, defaultCode);
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
            className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-600 text-slate-200 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/20 active:scale-95 border border-transparent hover:border-slate-500 cursor-pointer"
          >
            <FaPlay className={`text-green-400 text-xs ${evaluating ? 'animate-pulse' : ''}`} />
            {evaluating ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={evaluating || submitting}
            className="group flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-cyan-500/40 active:scale-95 cursor-pointer"
          >
            <FaCloudUploadAlt className={`text-lg group-hover:-translate-y-1 transition-transform duration-300 ${submitting ? 'animate-bounce' : ''}`} />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left Pane: Problem Description */}
        <div className="w-1/2 flex flex-col bg-[#282828] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden hover:border-slate-600 transition-colors duration-300">
          <div className="flex bg-[#333333] px-3 pt-2 gap-2 border-b border-slate-700/80">
            <button
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'description' ? 'bg-[#282828] text-cyan-400 shadow-[0_-2px_0_0_#06b6d4]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#2e2e2e]'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
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

                <div className="mt-8 space-y-6">
                  {problem.examples?.map((tc, idx) => (
                    <div key={idx} className="group">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded-full flex items-center justify-center text-xs group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">{idx + 1}</span>
                        Example {idx + 1}:
                      </h3>
                      <div className="bg-[#1e1e1e] p-5 rounded-xl border-l-4 border-cyan-500/50 group-hover:border-cyan-400 font-mono text-sm shadow-inner transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10">
                        <div className="mb-2"><span className="text-slate-500 select-none mr-2">Input:</span><span className="text-slate-200 bg-slate-800 px-2 py-1 rounded">{typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)}</span></div>
                        <div className="mb-2"><span className="text-slate-500 select-none mr-2">Output:</span><span className="text-green-400/90 bg-slate-800 px-2 py-1 rounded">{typeof tc.output === 'object' ? JSON.stringify(tc.output) : String(tc.output)}</span></div>
                        {tc.explanation && (<div className="mt-4 pt-3 border-t border-slate-800/50 leading-relaxed"><span className="text-slate-500 select-none block mb-1">Explanation:</span><span className="text-slate-400 text-xs font-sans">{tc.explanation}</span></div>)}
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
          <div className={fullscreen ? "fixed inset-0 z-50 bg-[#1a1a1a] flex flex-col" : "flex-1 flex flex-col bg-[#282828] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden min-h-[50%] hover:border-slate-600 transition-colors duration-300"}>
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#333333] border-b border-slate-700/80">
              <div className="relative group">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="appearance-none bg-[#404040] text-slate-200 text-xs font-semibold pl-3 pr-8 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-[#4a4a4a] hover:text-white transition-all shadow-sm border border-slate-600/50 focus:border-cyan-500/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-white transition-colors">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>

              <div className="relative group ml-3">
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value)}
                  className="appearance-none bg-[#404040] text-slate-200 text-xs font-semibold pl-3 pr-8 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-[#4a4a4a] hover:text-white transition-all shadow-sm border border-slate-600/50 focus:border-cyan-500/50"
                >
                  <option value="vs-dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-white transition-colors">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>

              <div className="flex-1 flex justify-end gap-3">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {fullscreen ? <FiMinimize /> : <FiMaximize />}
                </button>
                <button
                  onClick={handleReset}
                  className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer group"
                  title="Reset to default code"
                >
                  <FaRedo className="group-hover:-rotate-180 transition-transform duration-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e]">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                theme={editorTheme}
                onMount={editorMount}
              />
            </div>
          </div>

          {/* Console Area */}
          <div className="h-64 flex flex-col bg-[#282828] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden shrink-0 hover:border-slate-600 transition-colors duration-300">
            <div className="flex bg-[#333333] px-3 pt-2 gap-2 border-b border-slate-700/80">
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-300 flex items-center gap-2 ${consoleTab === 'testcases' ? 'bg-[#282828] text-white shadow-[0_-2px_0_0_#3b82f6]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#2e2e2e]'}`}
                onClick={() => setConsoleTab('testcases')}
              >
                Testcases
              </button>
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-300 flex items-center gap-2 ${consoleTab === 'result' ? 'bg-[#282828] text-green-400 shadow-[0_-2px_0_0_#22c55e]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#2e2e2e]'}`}
                onClick={() => setConsoleTab('result')}
              >
                Test Result
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
              {consoleTab === 'testcases' && (
                <div className="flex flex-col h-full">
                  <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2 shrink-0">
                    {problem.examples?.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsCustomInput(false);
                          setSelectedCase(idx);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${!isCustomInput && selectedCase === idx
                            ? 'bg-slate-700 text-white shadow-lg shadow-slate-900/20'
                            : 'bg-[#2a2a2a] text-slate-400 hover:text-slate-200 hover:bg-[#333]'
                          }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomInput(true)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${isCustomInput
                        ? 'bg-slate-700 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-[#2a2a2a] text-slate-400 hover:text-slate-200 hover:bg-[#333]'
                        }`}
                    >
                      Custom
                    </button>
                  </div>

                  {isCustomInput ? (
                    <div className="flex-1 flex flex-col h-full">
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter custom input here..."
                        className="flex-1 bg-[#1e1e1e] border border-slate-700/50 rounded-lg p-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-purple-500/50 resize-none h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="bg-[#1e1e1e] p-3 rounded-lg border border-slate-700 font-mono text-sm max-h-48 overflow-y-auto">
                        <div className="mb-2 text-slate-500 font-semibold">Input</div>
                        <div className="text-slate-200 mb-4 whitespace-pre-wrap">
                          {JSON.stringify(problem.examples?.[selectedCase]?.input, null, 2)}
                        </div>
                        <div className="mb-2 text-slate-500 font-semibold">Expected Output</div>
                        <div className="text-slate-200 whitespace-pre-wrap">
                          {JSON.stringify(problem.examples?.[selectedCase]?.output, null, 2)}
                        </div>
                      </div>
                    </div>
                  )}
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