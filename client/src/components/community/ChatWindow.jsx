import { useEffect, useRef } from "react";

import useCommunity from "../../hooks/useCommunity";

import ChatMessage from "./ChatMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const ChatWindow = ({ groupId, currentUserId }) => {
  const {
    messages,
    loading,
    loadMessages,
  } = useCommunity();

  const bottomRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (groupId) {
      loadMessages(groupId);
    }
  }, [groupId]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return <LoadingSkeleton type="chat" />;
  }

  if (!loading && messages.length === 0) {
    return (
      <EmptyState
        title="No Messages Yet"
        description="Start the conversation by sending the first message in this study group."
      />
    );
  }

  return (
    <div className="bg-slate-50/40 backdrop-blur-sm border border-slate-200/80 rounded-2xl h-[500px] overflow-y-auto p-5 custom-scrollbar shadow-inner">

      <div className="space-y-1">

        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={bottomRef} />

      </div>

    </div>
  );
};

export default ChatWindow;