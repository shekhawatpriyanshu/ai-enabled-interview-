import QuestionRow from "./QuestionRow";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const QuestionTable = ({
  questions = [],
  loading = false,
}) => {
  if (loading) {
    return <LoadingSkeleton type="table" rows={8} />;
  }

  if (!questions || questions.length === 0) {
    return (
      <EmptyState
        title="No Questions Found"
        description="Try adjusting your filters or add new questions."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Difficulty</th>
            <th className="px-4 py-3 text-left">Topic</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Tags</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((q) => (
            <QuestionRow
              key={q._id}
              question={q}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;