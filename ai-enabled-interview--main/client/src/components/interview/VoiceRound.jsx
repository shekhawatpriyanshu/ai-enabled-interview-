import { useState } from "react";

const VoiceRound = ({ interview, onSubmit, submitting }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const allQuestions = [
    ...(interview?.voiceInterview?.technicalQuestions || []),
    ...(interview?.voiceInterview?.hrQuestions || [])
  ];

  const handleNext = () => {
    if (currentAnswer.trim()) {
      setTranscript([
        ...transcript,
        { speaker: "AI", text: allQuestions[currentQuestionIdx] },
        { speaker: "User", text: currentAnswer }
      ]);
    }
    setCurrentAnswer("");
    setCurrentQuestionIdx((prev) => prev + 1);
  };

  const handleFinalSubmit = () => {
    let finalTranscript = transcript;
    if (currentAnswer.trim()) {
      finalTranscript = [
        ...transcript,
        { speaker: "AI", text: allQuestions[currentQuestionIdx] },
        { speaker: "User", text: currentAnswer }
      ];
    }
    onSubmit(finalTranscript);
  };

  if (allQuestions.length === 0) {
    return <div className="text-white text-center py-20">Loading Voice AI...</div>;
  }

  const isLastQuestion = currentQuestionIdx === allQuestions.length - 1;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-5xl mb-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] animate-[pulse_2s_ease-in-out_infinite]">
          🎙️
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Round 3: AI Voice Interview
        </h2>
        <p className="text-slate-400">
          The AI has analyzed your previous rounds and generated personalized questions.
          <br />(Note: Text input is used as a fallback for microphone).
        </p>
      </div>

      {/* AI Question */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700 p-8 shadow-2xl mb-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 shrink-0 rounded-full bg-cyan-900/50 flex items-center justify-center text-xl border border-cyan-700">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">
              AI Interviewer (Question {currentQuestionIdx + 1} of {allQuestions.length})
            </h3>
            <p className="text-2xl text-white font-medium leading-relaxed">
              "{allQuestions[currentQuestionIdx]}"
            </p>
          </div>
        </div>
      </div>

      {/* User Input */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 p-6 shadow-2xl mb-8 relative">
        <h3 className="text-purple-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Your Answer
        </h3>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Speak or type your answer here..."
          className="w-full h-40 bg-slate-900/50 text-white rounded-xl p-4 border border-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
        ></textarea>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-slate-500 text-sm">
          Take your time to think before answering.
        </div>
        
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={submitting || !currentAnswer.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl cursor-pointer font-bold shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Finishing Interview..." : "Finish Interview"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceRound;
