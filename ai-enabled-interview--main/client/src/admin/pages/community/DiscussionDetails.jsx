import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaThumbsUp,
  FaCommentDots,
  FaCalendarAlt,
} from "react-icons/fa";

import AdminCommunityService from "../../services/AdminCommunityService";

const DiscussionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [discussion, setDiscussion] = useState(null);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);

      const res =
        await AdminCommunityService.getDiscussionById(id);

      if (res.data.success) {
        setDiscussion(res.data.discussion);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading discussion...
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="p-6 text-center">
        Discussion not found.
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 mb-6"
      >
        <FaArrowLeft />
        Back
      </button>

      {/* Discussion */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h1 className="text-3xl font-bold">
          {discussion.title}
        </h1>

        <div className="flex flex-wrap gap-6 mt-5 text-gray-600">

          <div className="flex items-center gap-2">
            <FaUser />
            {discussion.user?.name}
          </div>

          <div className="flex items-center gap-2">
            <FaThumbsUp />
            {discussion.totalLikes}
          </div>

          <div className="flex items-center gap-2">
            <FaCommentDots />
            {discussion.totalComments}
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            {new Date(
              discussion.createdAt
            ).toLocaleString()}
          </div>

        </div>

        <hr className="my-6" />

        <p className="whitespace-pre-line leading-8">
          {discussion.content}
        </p>

        {discussion.tags?.length > 0 && (

          <div className="mt-6 flex flex-wrap gap-2">

            {discussion.tags.map((tag) => (

              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                #{tag}
              </span>

            ))}

          </div>

        )}

      </div>

      {/* Comments */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-6">
          Comments ({discussion.comments.length})
        </h2>

        {discussion.comments.length === 0 ? (

          <p className="text-gray-500">
            No comments found.
          </p>

        ) : (

          <div className="space-y-5">

            {discussion.comments.map((comment) => (

              <div
                key={comment._id}
                className="border rounded-lg p-4"
              >

                <div className="flex justify-between">

                  <div>

                    <h3 className="font-semibold">
                      {comment.user?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {comment.user?.email}
                    </p>

                  </div>

                  <span className="text-xs text-gray-500">
                    {new Date(
                      comment.createdAt
                    ).toLocaleString()}
                  </span>

                </div>

                <p className="mt-3 whitespace-pre-line">
                  {comment.text}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default DiscussionDetails;