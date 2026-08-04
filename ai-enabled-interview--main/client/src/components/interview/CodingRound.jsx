import { useState } from "react";
import CodeEditor from "../coding/CodeEditor";
import axios from "axios";
import { FaPlay, FaCloudUploadAlt, FaCode, FaTerminal, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const CodingRound = ({ interview, codingQuestions, onSubmit, submitting }) => {
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [submissions, setSubmissions] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [activeTab, setActiveTab] = useState("description"); // "description" or "editorial" etc.
  const [consoleTab, setConsoleTab] = useState("testcases"); // "testcases" or "result"

  const currentQuestion = codingQuestions[currentProblemIdx];
  const currentLanguage = selectedLanguages[currentProblemIdx] || "javascript";
  const currentCode = submissions[currentProblemIdx] !== undefined ? submissions[currentProblemIdx] : currentQuestion.starterCode;

  const handleCodeChange = (newCode) => {
    setSubmissions({ ...submissions, [currentProblemIdx]: newCode });
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguages({ ...selectedLanguages, [currentProblemIdx]: e.target.value });
  };

  const runTestCases = async () => {
    if (!currentCode) return;
    setEvaluating(true);
    setConsoleTab("result"); // Auto switch to result tab
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/interviews/run-code",
        { code: currentCode, language: currentLanguage, testCases: currentQuestion.testCases },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      setResults({ ...results, [currentProblemIdx]: { status: data.status, score: data.score, errorOutput: data.errorOutput } });

    } catch (error) {
      setResults({ ...results, [currentProblemIdx]: { status: "Execution Failed", score: 0, errorOutput: error.message } });
    } finally {
      setEvaluating(false);
    }
  };

  const handleFinalSubmit = () => {
    const formattedQuestions = codingQuestions.map((q, idx) => ({
      ...q,
      codeSubmitted: submissions[idx] || q.starterCode,
      languageSubmitted: selectedLanguages[idx] || "javascript",
      status: results[idx]?.status || "Submitted",
      score: results[idx]?.score || 0
    }));
    onSubmit(formattedQuestions);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a1a1a] text-slate-300 font-sans overflow-hidden">
      {/* Navbar */}
      <div className="h-14 bg-[#282828] border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <FaCode className="text-cyan-500 text-xl" />
          <span className="font-semibold text-white">Interview Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentProblemIdx === 0} 
            onClick={() => setCurrentProblemIdx(prev => prev - 1)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-30 transition"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm font-medium text-slate-200">
            Problem {currentProblemIdx + 1} / {codingQuestions.length}
          </span>
          <button 
            disabled={currentProblemIdx === codingQuestions.length - 1}
            onClick={() => setCurrentProblemIdx(prev => prev + 1)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-30 transition"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={runTestCases}
            disabled={evaluating}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <FaPlay className="text-green-400 text-xs" />
            {evaluating ? "Running..." : "Run"}
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <FaCloudUploadAlt className="text-lg" />
            {submitting ? "Submitting..." : "Submit Round"}
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
          <div className="flex-1 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activeTab === 'description' && (
              <>
                <h1 className="text-2xl font-bold text-white mb-4">{currentQuestion.problemTitle}</h1>
                <div className="mb-6 whitespace-pre-wrap leading-relaxed text-sm">
                  {currentQuestion.problemDescription}
                </div>
                
                <div className="mt-8">
                  {currentQuestion.testCases?.map((tc, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="text-white font-semibold mb-2">Example {idx + 1}:</h3>
                      <div className="bg-[#1e1e1e] p-4 rounded-lg border-l-4 border-cyan-500 font-mono text-sm shadow-inner">
                        <div className="mb-2"><span className="text-slate-500 select-none">Input: </span><span className="text-slate-300">{tc.input}</span></div>
                        <div><span className="text-slate-500 select-none">Output: </span><span className="text-slate-300">{tc.output}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
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
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="bg-[#333333] text-slate-200 text-xs font-medium px-2 py-1 outline-none cursor-pointer hover:bg-slate-700 rounded transition"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
              <div className="text-slate-400 text-xs flex gap-2">
                 <button className="hover:text-white transition"><FaTerminal /></button>
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e]">
              <CodeEditor
                code={currentCode}
                setCode={handleCodeChange}
                language={currentLanguage}
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
            <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {consoleTab === 'testcases' && (
                <div className="flex flex-col gap-4">
                  {currentQuestion.testCases?.map((tc, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">{idx+1}</div>
                      <div className="flex-1 bg-[#1e1e1e] p-3 rounded-lg border border-slate-700 font-mono text-sm">
                        <div className="mb-1 text-slate-500">Input</div>
                        <div className="text-slate-200">{tc.input}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {consoleTab === 'result' && (
                <div className="flex flex-col h-full">
                  {evaluating ? (
                    <div className="m-auto text-slate-400 flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                      Evaluating your code...
                    </div>
                  ) : results[currentProblemIdx] ? (
                    <div>
                      <h2 className={`text-xl font-bold mb-4 ${results[currentProblemIdx].status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                        {results[currentProblemIdx].status}
                      </h2>
                      {results[currentProblemIdx].errorOutput ? (
                        <div className="bg-[#1e1e1e] p-4 rounded-lg border border-red-900/50 text-red-400 font-mono text-sm whitespace-pre-wrap">
                          {results[currentProblemIdx].errorOutput}
                        </div>
                      ) : (
                        <div className="text-slate-300">
                          <p>Score: <span className="font-mono text-cyan-400">{results[currentProblemIdx].score}/100</span></p>
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

export default CodingRound;
