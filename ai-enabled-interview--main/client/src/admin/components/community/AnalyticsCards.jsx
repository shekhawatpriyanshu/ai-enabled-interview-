const AnalyticsCards = ({ stats }) => {
  const discussionPercent =
    stats.totalUsers > 0
      ? (
          (stats.totalDiscussions / stats.totalUsers) *
          100
        ).toFixed(1)
      : 0;

  const commentPercent =
    stats.totalDiscussions > 0
      ? (
          (stats.totalComments / stats.totalDiscussions)
        ).toFixed(1)
      : 0;

  const messagePercent =
    stats.totalGroups > 0
      ? (
          (stats.totalMessages / stats.totalGroups)
        ).toFixed(1)
      : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white rounded-xl shadow border p-6">

        <h3 className="text-lg font-semibold">
          User Participation
        </h3>

        <p className="text-4xl font-bold mt-5 text-blue-600">
          {discussionPercent}%
        </p>

        <p className="text-gray-500 mt-2">
          Discussions per registered user
        </p>

      </div>

      <div className="bg-white rounded-xl shadow border p-6">

        <h3 className="text-lg font-semibold">
          Discussion Engagement
        </h3>

        <p className="text-4xl font-bold mt-5 text-green-600">
          {commentPercent}
        </p>

        <p className="text-gray-500 mt-2">
          Average comments per discussion
        </p>

      </div>

      <div className="bg-white rounded-xl shadow border p-6">

        <h3 className="text-lg font-semibold">
          Group Activity
        </h3>

        <p className="text-4xl font-bold mt-5 text-orange-600">
          {messagePercent}
        </p>

        <p className="text-gray-500 mt-2">
          Average messages per group
        </p>

      </div>

    </div>
  );
};

export default AnalyticsCards;