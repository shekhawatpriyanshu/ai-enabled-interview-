import { User } from "lucide-react";

const ChatMessage = ({
  message,
  currentUserId,
}) => {
  const isOwnMessage =
    message.sender?._id === currentUserId;

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="flex items-center gap-2 mb-2.5">

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

        {/* Message Content */}
        <p
          className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
            isOwnMessage
              ? "text-white"
              : "text-slate-600"
          }`}
        >
          {message.message}
        </p>

      </div>
    </div>
  );
};

export default ChatMessage;