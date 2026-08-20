import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mic, MicOff, Send, CheckCircle2, Volume2, VolumeX } from "lucide-react";

const VoiceRound = ({ interview, onSubmit, submitting }) => {
  const [transcript, setTranscript] = useState(interview?.voiceInterview?.transcript || []);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiVoiceEnabled, setIsAiVoiceEnabled] = useState(true);
  const [initialReadDone, setInitialReadDone] = useState(false);
  
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Pre-load and sync browser voices asynchronously (Chrome/Edge/Safari requirement)
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setCurrentAnswer((prev) => (prev + " " + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          toast.error("Microphone error. Please type your answer.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, isAiThinking]);

  const speakText = (text) => {
    if (!text || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume(); // Unpause Chrome TTS audio engine

      if (!isAiVoiceEnabled) return;

      const cleanText = text.replace(/[*_#`~]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';

      const voicesList = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const preferredVoice =
        voicesList.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("David"))) ||
        voicesList.find((v) => v.lang.startsWith("en")) ||
        voicesList[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsAiSpeaking(false);
      };

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (err) {
      console.error("SpeechSynthesis speak exception:", err);
      setIsAiSpeaking(false);
    }
  };

  useEffect(() => {
    if (!initialReadDone && transcript.length > 0) {
      const lastMsg = transcript[transcript.length - 1];
      if (lastMsg.speaker === 'AI' && !isAiSpeaking) {
        setTimeout(() => speakText(lastMsg.text), 500); 
      }
      setInitialReadDone(true);
    }
  }, [transcript, initialReadDone, isAiVoiceEnabled, availableVoices]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        return toast.error("Speech recognition not supported in this browser. Please type.");
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
        // Stop AI speaking if user starts talking
        if (isAiSpeaking && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsAiSpeaking(false);
        }
      } catch (err) {
        console.error("Start error", err);
      }
    }
  };

  const startConversation = async () => {
    if ('speechSynthesis' in window) {
      const unlock = new SpeechSynthesisUtterance(' ');
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }
    await sendToAi([], true);
  };

  const handleSend = async () => {
    if (!currentAnswer.trim()) return;
    
    if ('speechSynthesis' in window) {
      const unlock = new SpeechSynthesisUtterance(' ');
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const newTranscript = [...transcript, { speaker: "User", text: currentAnswer.trim() }];
    setTranscript(newTranscript);
    setCurrentAnswer("");
    
    await sendToAi(newTranscript, false);
  };

  const sendToAi = async (currentTranscript, isStart = false) => {
    setIsAiThinking(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/api/interviews/chat-voice/${interview._id}`,
        { transcript: currentTranscript },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setTranscript(res.data.transcript);
        speakText(res.data.aiResponse);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to get response from AI");
      // Revert user message if it failed
      if (!isStart) {
        setTranscript(currentTranscript.slice(0, -1));
        setCurrentAnswer(currentTranscript[currentTranscript.length - 1].text);
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleFinalSubmit = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onSubmit(transcript);
  };

  const aiQuestionsCount = transcript.filter((m) => m.speaker === "AI").length;
  let aiMsgCounter = 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 shrink-0">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-4xl mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-[pulse_2s_ease-in-out_infinite]">
          {isAiSpeaking ? "🔊" : isListening ? "🎙️" : "💬"}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Round 3: Interactive Voice AI
        </h2>
        <p className="text-slate-400 text-sm">
          Have a live conversation with our AI interviewer.
        </p>

        {/* TOTAL QUESTIONS COUNTER BADGE */}
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <span>❓ AI Questions Progress:</span>
            <span className="bg-cyan-500 text-black font-black font-mono text-xs px-2.5 py-0.5 rounded-full">
              {aiQuestionsCount} / 15
            </span>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full">
            <span>💻 8 Technical + 🤝 7 HR & Behavioral</span>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700 p-6 shadow-2xl mb-6 overflow-y-auto space-y-6"
      >
        {transcript.length === 0 && !isAiThinking && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="mb-6">The AI is ready to begin your interview (15 Questions: 8 Technical & 7 HR/Behavioral).</p>
            <button
              onClick={startConversation}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Interview
            </button>
          </div>
        )}

        {transcript.map((msg, idx) => {
          let currentQNum = 0;
          if (msg.speaker === "AI") {
            aiMsgCounter++;
            currentQNum = aiMsgCounter;
          }

          return (
            <div 
              key={idx} 
              className={`flex ${msg.speaker === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.speaker === 'User' 
                  ? 'bg-purple-600/20 border border-purple-500/30 text-white rounded-br-none' 
                  : 'bg-cyan-900/20 border border-cyan-700/30 text-cyan-50 rounded-bl-none'
              }`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between gap-2 ${
                  msg.speaker === 'User' ? 'text-purple-400' : 'text-cyan-400'
                }`}>
                  <span>
                    {msg.speaker === 'AI' 
                      ? `🤖 AI Question #${currentQNum} (${currentQNum <= 8 ? "Technical" : "HR & Behavioral"})` 
                      : '👤 You'}
                  </span>
                  {msg.speaker === 'AI' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/20 rounded-lg transition cursor-pointer"
                      title="Speak Question Aloud 🔊"
                    >
                      <Volume2 size={15} />
                    </button>
                  )}
                </div>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
        
        {isAiThinking && (
          <div className="flex justify-start">
             <div className="max-w-[80%] rounded-2xl p-5 bg-cyan-900/20 border border-cyan-700/30 text-cyan-50 rounded-bl-none flex items-center gap-3">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
               <span className="text-sm text-cyan-400 italic">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {transcript.length > 0 && (
        <div className="shrink-0 space-y-4">
          <div className="relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your answer or use the microphone..."}
              disabled={isAiThinking || isAiSpeaking}
              className={`w-full h-24 bg-slate-800 text-white rounded-2xl p-4 pr-16 border ${
                isListening ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-600'
              } focus:outline-none focus:border-purple-500 resize-none transition-all`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <button
              onClick={toggleListen}
              disabled={isAiThinking || isAiSpeaking}
              className={`absolute right-4 bottom-4 p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                disabled={!currentAnswer.trim() || isAiThinking || isAiSpeaking}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={18} /> Send Answer
              </button>
              <button
                onClick={() => {
                  if (isAiSpeaking && isAiVoiceEnabled && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsAiSpeaking(false);
                  }
                  setIsAiVoiceEnabled(!isAiVoiceEnabled);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                  isAiVoiceEnabled 
                    ? 'bg-slate-700 hover:bg-slate-600 text-cyan-400' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                }`}
                title={isAiVoiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
              >
                {isAiVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={submitting || transcript.length < 2 || isAiThinking}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 size={18} /> {submitting ? "Finishing..." : "Finish Interview"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRound;
