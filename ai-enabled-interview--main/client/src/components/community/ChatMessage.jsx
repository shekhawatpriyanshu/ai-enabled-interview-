import { useState } from "react";
import { User, FileText, Download, Pencil, Trash2 } from "lucide-react";
import useCommunity from "../../hooks/useCommunity";

import { getBackendUrl } from "../../api/config";

const BACKEND_URL = getBackendUrl();

const ChatMessage = ({
  message,
  currentUserId,
}) => {
  const { updateMessage, removeMessage } = useCommunity();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message || "");

  const isOwnMessage =
    message.sender?._id === currentUserId;

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAbsoluteFileUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      await updateMessage(message._id, editText);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(message.message || "");
    }
  };

  const handleDelete = async () => {
    try {
      await removeMessage(message._id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div
      className={`flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4.5 py-3.5 shadow-sm border ${
          isOwnMessage
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent"
            : "bg-white border-slate-200/80 text-slate-800"
        }`}
      >
        {/* Sender details */}
        <div className="flex items-center gap-2 mb-2.5 justify-between">

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                isOwnMessage
                  ? "bg-white/20 text-white"
                  : "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white"
              }`}
            >
              {message.sender?.name ? (
                message.sender.name
                  .charAt(0)
                  .toUpperCase()
              ) : (
                <User size={13} />
              )}
            </div>

            <div className="flex flex-col">
              <h4
                className={`font-bold text-xs ${
                  isOwnMessage
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                {isOwnMessage
                  ? "You"
                  : message.sender?.name ||
                    "Unknown"}
              </h4>

              <span
                className={`text-[9px] font-medium ${
                  isOwnMessage
                    ? "text-cyan-100"
                    : "text-slate-400"
                }`}
              >
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>

          {isOwnMessage && !isEditing && (
            <div className="flex gap-1 ml-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all duration-150 focus:outline-none"
                title="Edit message"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={handleDelete}
                className="text-white/60 hover:text-red-300 hover:bg-white/10 rounded-full p-1.5 transition-all duration-150 focus:outline-none"
                title="Delete message"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}

        </div>

        {/* Message Content */}
        {isEditing ? (
          <div className="mt-2 space-y-2 min-w-[200px]">
            <textarea
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-slate-800 text-sm px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 resize-none outline-none"
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(message.message || "");
                }}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/20 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-white text-cyan-600 hover:bg-slate-50 text-[10px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          message.message && (
            <p
              className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
                isOwnMessage
                  ? "text-white"
                  : "text-slate-600"
              }`}
            >
              {message.message}
            </p>
          )
        )}

        {/* Attachment Content */}
        {message.fileUrl && (
          <div className="mt-3">
            {message.fileType === "image" && (
              <div className="rounded-xl overflow-hidden max-w-xs sm:max-w-sm shadow-sm border border-slate-100/10">
                <img 
                  src={getAbsoluteFileUrl(message.fileUrl)} 
                  alt={message.fileName || "Image attachment"} 
                  className="w-full h-auto object-cover max-h-60 hover:opacity-95 transition cursor-pointer"
                  onClick={() => window.open(getAbsoluteFileUrl(message.fileUrl), "_blank")}
                />
              </div>
            )}

            {message.fileType === "video" && (
              <div className="rounded-xl overflow-hidden max-w-xs sm:max-w-sm shadow-sm border border-slate-100 bg-black">
                <video src={getAbsoluteFileUrl(message.fileUrl)} controls className="w-full h-auto max-h-60" />
              </div>
            )}

            {message.fileType === "audio" && (
              <div className="rounded-xl overflow-hidden max-w-xs p-2 bg-slate-50 border border-slate-100">
                <audio src={getAbsoluteFileUrl(message.fileUrl)} controls className="w-full" />
              </div>
            )}

            {message.fileType !== "image" && message.fileType !== "video" && message.fileType !== "audio" && (
              <a 
                href={getAbsoluteFileUrl(message.fileUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 select-none ${
                  isOwnMessage 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isOwnMessage ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                }`}>
                  <FileText size={18} />
                </div>
                <div className="overflow-hidden flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold truncate leading-none mb-1">{message.fileName || "Download File"}</p>
                  <span className={`text-[9px] block ${isOwnMessage ? "text-cyan-100" : "text-slate-400"}`}>Click to download</span>
                </div>
                <div className={`flex-shrink-0 ${isOwnMessage ? "text-white" : "text-slate-400"}`}>
                  <Download size={15} />
                </div>
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;