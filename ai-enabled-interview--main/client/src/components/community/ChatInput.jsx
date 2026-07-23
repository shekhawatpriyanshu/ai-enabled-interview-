import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
  "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏",
  "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠",
  "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥",
  "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
  "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻",
  "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "👋",
  "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕",
  "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅",
  "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁",
  "👅", "👄", "💋", "🩸", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹",
  "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "🔥", "✨", "⭐", "🌟", "⚡", "💥", "💯", "🎉"
];

const ChatInput = ({ groupId }) => {
  const { createMessage } = useCommunity();

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const pickerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      setSending(true);

      await createMessage(groupId, message, file);

      setMessage("");
      setFile(null);
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

  const handleEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + emoji + after;
      setMessage(newText);
      
      // Reset cursor position after inserting emoji
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const isSendDisabled = sending || (!message.trim() && !file);

  return (
    <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-sm p-4">

      {/* File Preview */}
      {file && (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-[10px]">
              {file.type.startsWith("image/") ? "IMG" : "FILE"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
              <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setFile(null)} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full p-1 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-3 items-end relative">

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <div className="flex gap-1">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center p-3 rounded-xl hover:bg-slate-100 transition text-slate-500 hover:text-slate-800 focus:outline-none"
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>

          {/* Emoji Picker Button */}
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="flex items-center justify-center p-3 rounded-xl hover:bg-slate-100 transition text-slate-500 hover:text-slate-800 focus:outline-none"
              title="Add Emoji"
            >
              <Smile size={20} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl w-64 p-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="text-xs font-bold text-slate-400 mb-2 select-none uppercase tracking-wider">Emojis</div>
                <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {EMOJIS.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="hover:bg-slate-100 text-lg p-1 rounded transition-colors duration-100 flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          rows={2}
          value={message}
          placeholder={file ? "Add a caption..." : "Type your message..."}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-xl border border-slate-200/80 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-slate-50/50 hover:bg-slate-50 transition"
        />

        <button
          onClick={handleSend}
          disabled={isSendDisabled}
          className={`flex items-center gap-1.5 rounded-xl px-5 py-3 text-white font-bold text-sm shadow-md transition-all duration-200 ${
            isSendDisabled
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