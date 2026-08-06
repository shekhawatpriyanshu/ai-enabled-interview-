import {
  FaTrash,
  FaPaperclip,
  FaFileAlt,
  FaImage,
  FaFilePdf,
  FaUser,
  FaLayerGroup,
  FaComments,
} from "react-icons/fa";

const MessageTable = ({ messages = [], loading = false, onDelete }) => {
  const getFileIcon = (fileType) => {
    if (!fileType) return null;

    if (fileType.includes("image")) {
      return <FaImage className="text-emerald-500" />;
    }

    if (fileType.includes("pdf")) {
      return <FaFilePdf className="text-rose-500" />;
    }

    return <FaFileAlt className="text-indigo-500" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-amber-500/30 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Group Messages...
        </p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
          <FaComments />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Messages Found</h3>
        <p className="text-slate-500 text-xs font-semibold">
          No group messages match your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[850px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Sender
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Study Group
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Message
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Attachment
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[120px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {messages.map((message) => (
            <tr
              key={message._id}
              className="hover:bg-gradient-to-r hover:from-amber-50/60 hover:via-orange-50/30 hover:to-yellow-50/40 transition-all duration-300 group"
            >
              {/* Sender */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {message.sender?.name || "Anonymous Member"}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold truncate">
                      {message.sender?.email || "-"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Group */}
              <td className="px-6 py-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold shadow-sm truncate max-w-[180px]">
                  <FaLayerGroup className="text-purple-500 text-[10px] shrink-0" />
                  {message.group?.name || "Study Group"}
                </span>
              </td>

              {/* Message Text */}
              <td className="px-6 py-4 text-left">
                <div className="bg-slate-50/80 group-hover:bg-white p-3 rounded-xl border border-slate-100 group-hover:border-amber-200 transition-all">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2 max-w-md">
                    {message.message || "-"}
                  </p>
                </div>
              </td>

              {/* Attachment */}
              <td className="px-6 py-4 text-center">
                {message.fileUrl ? (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 text-xs font-extrabold transition-all shadow-sm active:scale-95"
                    title={message.fileName || "View Attachment"}
                  >
                    {getFileIcon(message.fileType)}
                    <FaPaperclip className="text-[11px]" />
                    <span className="truncate max-w-[80px]">{message.fileName || "File"}</span>
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">-</span>
                )}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(message.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => onDelete(message)}
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageTable;