import { FaTimes, FaComments, FaUser, FaLayerGroup, FaCalendarAlt, FaPaperclip, FaFileAlt, FaImage, FaFilePdf } from "react-icons/fa";

const ViewMessageModal = ({ open, message, onClose }) => {
  if (!open || !message) return null;

  const getFileIcon = (fileType) => {
    if (!fileType) return null;
    if (fileType.includes("image")) return <FaImage className="text-emerald-500" />;
    if (fileType.includes("pdf")) return <FaFilePdf className="text-rose-500" />;
    return <FaFileAlt className="text-indigo-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden relative z-10 animate-[scaleUp_0.2s_ease-out]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
              <FaComments />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Message Details
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Viewing full group message & metadata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center text-sm transition-all cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-left">
          {/* Sender & Group Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Sender Info
              </span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {message.sender?.name?.charAt(0)?.toUpperCase() || <FaUser />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {message.sender?.name || "Anonymous Member"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold truncate">
                    {message.sender?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Study Group
              </span>
              <div className="flex items-center gap-1.5 text-purple-700 font-black text-xs">
                <FaLayerGroup className="text-purple-500 text-xs shrink-0" />
                <span className="truncate">{message.group?.name || "Study Group"}</span>
              </div>
            </div>
          </div>

          {/* Full Message Text */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Message Content
            </span>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs font-medium leading-relaxed whitespace-pre-wrap shadow-inner max-h-60 overflow-y-auto">
              {message.message || "// Empty message text"}
            </div>
          </div>

          {/* Attachment Info */}
          {message.fileUrl && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Attachment File
              </span>
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-extrabold text-xs transition shadow-2xs"
              >
                {getFileIcon(message.fileType)}
                <FaPaperclip className="text-xs shrink-0" />
                <span>{message.fileName || "Download / View Attachment"}</span>
              </a>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-slate-400" />
              <span>Sent: {new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              ID: {message._id}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMessageModal;
