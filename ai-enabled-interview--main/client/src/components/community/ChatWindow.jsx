import { useEffect, useRef } from "react";
import { MessageCircle, Users } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";
import ChatMessage from "./ChatMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const ChatWindow = ({ groupId, currentUserId }) => {
  const { messages, loading, loadMessages } = useCommunity();

  const bottomRef = useRef(null);

  useEffect(() => {
    if (groupId) loadMessages(groupId);
  }, [groupId]);

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
      <div className="relative h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-2xl flex items-center justify-center">

        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <EmptyState
          title="No Messages Yet"
          description="Start the conversation with your study partners."
        />
      </div>
    );
  }

  return (
    <div className="relative h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
            <MessageCircle size={22} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Study Group Chat
            </h2>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

              <Users size={15} />

              <span>{messages.length} Messages</span>

            </div>

          </div>

        </div>

        <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 flex items-center gap-2 shadow">

          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>

          Live

        </div>

      </div>

      {/* Chat Body */}

      <div
        className="
          relative
          z-10
          h-[560px]
          overflow-y-auto
          px-6
          py-6
          custom-scrollbar
          bg-gradient-to-b
          from-slate-50
          via-white
          to-slate-100
        "
      >
        <div className="space-y-5">

          {messages.map((message, index) => {

            const showDate =
              index === 0 ||
              new Date(message.createdAt).toDateString() !==
                new Date(messages[index - 1].createdAt).toDateString();

            return (
              <div key={message._id}>

                {showDate && (

                  <div className="sticky top-2 z-20 flex justify-center">

                    <span className="rounded-full border border-slate-200 bg-white/90 px-4 py-1 text-xs font-medium text-slate-600 shadow backdrop-blur-lg">

                      {new Date(message.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}

                    </span>

                  </div>

                )}

                <div className="mt-4 transition-all duration-300 hover:scale-[1.01]">
                  <ChatMessage
                    message={message}
                    currentUserId={currentUserId}
                  />
                </div>

              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

      </div>

    </div>
  );
};

export default ChatWindow;