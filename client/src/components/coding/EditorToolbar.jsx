import { FaPlay, FaPaperPlane, FaCopy, FaDownload, FaUndo } from "react-icons/fa";
import { toast } from "react-hot-toast";

const EditorToolbar = ({
  code,
  language,
  onRun,
  onSubmit,
  onReset,
}) => {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const downloadCode = () => {
    const extensionMap = {
      javascript: "js",
      java: "java",
      python: "py",
      cpp: "cpp",
      c: "c",
    };

    const extension =
      extensionMap[language] || "txt";

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `solution.${extension}`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3">

      <button
        onClick={onRun}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <FaPlay />
        Run
      </button>

      <button
        onClick={onSubmit}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
      >
        <FaPaperPlane />
        Submit
      </button>

      <button
        onClick={copyCode}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition"
      >
        <FaCopy />
        Copy
      </button>

      <button
        onClick={downloadCode}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
      >
        <FaDownload />
        Download
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        <FaUndo />
        Reset
      </button>

    </div>
  );
};

export default EditorToolbar;