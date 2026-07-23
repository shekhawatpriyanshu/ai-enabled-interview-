import { useEffect } from "react";

import useCommunity from "../../hooks/useCommunity";

import CommentItem from "./CommentItem";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const CommentList = ({ discussionId }) => {
  const {
    comments,
    loading,
    loadComments,
  } = useCommunity();

  useEffect(() => {
    if (discussionId) {
      loadComments(discussionId);
    }
  }, [discussionId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && comments.length === 0) {
    return (
      <EmptyState
        title="No Comments Yet"
        description="Be the first person to comment on this discussion."
      />
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Comments
        </h3>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {comments.length}
        </span>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
          />
        ))}
      </div>

    </div>
  );
};

export default CommentList;