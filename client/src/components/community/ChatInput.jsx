import { useState } from "react";
import { Send } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const ChatInput = ({ groupId }) => {
  const { createMessage } = useCommunity();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);

      await createMessage(groupId, message);

      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-sm p-4">

      <div className="flex gap-3 items-end">

        <textarea
          rows={2}
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-xl border border-slate-200/80 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-slate-50/50 hover:bg-slate-50 transition"
        />

        <button
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className={`flex items-center gap-1.5 rounded-xl px-5 py-3 text-white font-bold text-sm shadow-md transition-all duration-200 ${
            sending || !message.trim()
              ? "bg-slate-300 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/10 hover:scale-[1.02]"
          }`}
        >
          <Send size={15} />

          {sending ? "Sending..." : "Send"}
        </button>

      </div>

      <p className="mt-2 text-[10px] text-slate-400">
        Press <span className="font-semibold">Enter</span> to send,
        <span className="font-semibold"> Shift + Enter</span> for a new line.
      </p>

    </div>
  );
};

export default ChatInput;