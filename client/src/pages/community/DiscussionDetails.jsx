import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  User,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import useCommunity from "../../hooks/useCommunity";

import CommentForm from "../../components/community/CommentForm";
import CommentList from "../../components/community/CommentList";
import EmptyState from "../../components/community/EmptyState";

const DiscussionDetails = () => {
  const { id } = useParams();

  const {
    discussions,
    toggleLikeDiscussion,
  } = useCommunity();

  const discussion = useMemo(() => {
    return discussions.find(
      (item) => item._id === id
    );
  }, [discussions, id]);

  if (!discussion) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-10 px-4">

          <EmptyState
            title="Discussion Not Found"
            description="The discussion you're looking for doesn't exist."
            buttonText="Back to Discussions"
            buttonLink="/community/discussions"
          />

        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="py-2">

        {/* Back Button */}

        <Link
          to="/community/discussions"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={18} />

          Back to Discussions
        </Link>

        {/* Discussion */}

        <div className="bg-white border rounded-xl shadow-sm p-8">

          {/* Author */}

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

              {discussion.user?.name
                ? discussion.user.name
                    .charAt(0)
                    .toUpperCase()
                : <User size={18} />}

            </div>

            <div>

              <h3 className="font-semibold text-lg">
                {discussion.user?.name ||
                  "Anonymous"}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm">

                <Calendar size={14} />

                {new Date(
                  discussion.createdAt
                ).toLocaleString()}

              </div>

            </div>

          </div>

          {/* Title */}

          <h1 className="text-3xl font-bold mb-5">
            {discussion.title}
          </h1>

          {/* Content */}

          <div className="text-gray-700 leading-8 whitespace-pre-wrap mb-8">
            {discussion.content}
          </div>

          {/* Tags */}

          {discussion.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">

              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}

            </div>
          )}

          {/* Actions */}

          <button
            onClick={() =>
              toggleLikeDiscussion(
                discussion._id
              )
            }
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-lg transition"
          >
            <Heart size={20} />

            Like

            <span className="font-semibold">
              ({discussion.likes?.length || 0})
            </span>

          </button>

        </div>

        {/* Add Comment */}

        <div className="mt-8">

          <CommentForm
            discussionId={discussion._id}
          />

        </div>

        {/* Comments */}

        <div className="mt-8">

          <CommentList
            discussionId={discussion._id}
          />

        </div>

      </div>

    </MainLayout>
  );
};

export default DiscussionDetails;