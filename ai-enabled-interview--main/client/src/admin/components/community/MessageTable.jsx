import {
  FaTrash,
  FaPaperclip,
  FaFileAlt,
  FaImage,
  FaFilePdf,
} from "react-icons/fa";

const MessageTable = ({
  messages = [],
  loading = false,
  onDelete,
}) => {
  const getFileIcon = (fileType) => {
    if (!fileType) return null;

    if (fileType.includes("image")) {
      return (
        <FaImage className="text-green-600" />
      );
    }

    if (fileType.includes("pdf")) {
      return (
        <FaFilePdf className="text-red-600" />
      );
    }

    return (
      <FaFileAlt className="text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <p className="text-gray-500">
          Loading messages...
        </p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <h2 className="text-lg font-semibold">
          No Messages Found
        </h2>

        <p className="text-gray-500 mt-2">
          No group messages are available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Sender</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Group</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Message</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Attachment</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Created</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {messages.map((message) => (
            <tr key={message._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-left">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{message.sender?.name}</h3>
                  <p className="text-xs text-slate-500">{message.sender?.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <p className="font-medium text-sm text-slate-900 line-clamp-1">{message.group?.name}</p>
              </td>
              <td className="px-6 py-4 text-left">
                <p className="text-sm text-slate-600 line-clamp-2 max-w-md">{message.message || "-"}</p>
              </td>
              <td className="px-6 py-4 text-center">
                {message.fileUrl ? (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {getFileIcon(message.fileType)}
                    <FaPaperclip className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {new Date(message.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => onDelete(message)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
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