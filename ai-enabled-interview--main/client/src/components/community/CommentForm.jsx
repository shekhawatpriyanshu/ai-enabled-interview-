import { useState } from "react";
import { Send } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const CommentForm = ({ discussionId }) => {
  const { createComment } = useCommunity();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createComment(discussionId, text);

      setText("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to post comment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h3 className="text-xl font-semibold mb-4">
        Add a Comment
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <textarea
          rows={5}
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send size={18} />

            {loading
              ? "Posting..."
              : "Post Comment"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CommentForm;