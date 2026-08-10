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
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <th className="px-5 py-4">Question Title</th>
              <th className="px-5 py-4">Difficulty</th>
              <th className="px-5 py-4">Topic</th>
              <th className="px-5 py-4">Company</th>
              <th className="px-5 py-4">Tags</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {questions.map((q) => (
              <QuestionRow
                key={q._id}
                question={q}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;