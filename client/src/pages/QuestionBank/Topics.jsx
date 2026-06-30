import { useEffect, useState } from "react";
import {
  getTopics,
} from "../../services/QuestionService";

import MainLayout from "../../layouts/MainLayout";
import TopicCard from "../../components/QuestionBank/TopicCard";
import LoadingSkeleton from "../../components/QuestionBank/LoadingSkeleton";
import EmptyState from "../../components/QuestionBank/EmptyState";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics
  const fetchTopics = async () => {
    try {
      setLoading(true);

      const res = await getTopics();

      setTopics(res.topics || []);
    } catch (error) {
      console.log("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton type="card" rows={6} />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Question Bank - Topics
        </h1>

        {/* Empty State */}
        {topics.length === 0 ? (
          <EmptyState
            title="No Topics Found"
            description="Start by creating your first topic."
            buttonText="Add Topic"
            buttonLink="/question-bank/topic/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic._id}
                topic={topic}
              />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Topics;