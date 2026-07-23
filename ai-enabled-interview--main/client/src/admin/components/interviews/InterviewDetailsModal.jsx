import { FaTimes } from "react-icons/fa";

const InterviewDetailsModal = ({
  isOpen,
  onClose,
  interview,
  feedback,
}) => {
  if (!isOpen || !interview) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">

      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-6">

          <div>
            <h2 className="text-2xl font-bold">
              Interview Details
            </h2>

            <p className="text-gray-500">
              Complete interview report
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            <FaTimes />
          </button>

        </div>

        <div className="p-6 space-y-8">

          {/* Candidate Information */}

          <section>

            <h3 className="text-lg font-semibold mb-4">
              Candidate Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">

              <InfoCard
                label="Name"
                value={interview.user?.name}
              />

              <InfoCard
                label="Email"
                value={interview.user?.email}
              />

              <InfoCard
                label="Role"
                value={interview.role}
              />

              <InfoCard
                label="Experience"
                value={interview.experienceLevel}
              />

              <InfoCard
                label="Status"
                value={interview.status}
              />

              <InfoCard
                label="Created"
                value={new Date(
                  interview.createdAt
                ).toLocaleString()}
              />

            </div>

          </section>

          {/* Questions */}

          <section>

            <h3 className="text-lg font-semibold mb-4">
              Questions & Answers
            </h3>

            <div className="space-y-5">

              {interview.questions?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-blue-600">
                      Q{index + 1}. {item.question}
                    </h4>

                    <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                      {item.answer ||
                        "No answer submitted"}
                    </p>
                  </div>
                )
              )}

            </div>

          </section>

          {/* Feedback */}

          {feedback && (
            <section>

              <h3 className="text-lg font-semibold mb-4">
                AI Feedback
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                <ScoreCard
                  title="Overall"
                  score={feedback.score}
                />

                <ScoreCard
                  title="Communication"
                  score={feedback.communication}
                />

                <ScoreCard
                  title="Technical"
                  score={feedback.technicalKnowledge}
                />

                <ScoreCard
                  title="Problem Solving"
                  score={feedback.problemSolving}
                />

              </div>

              <div className="grid md:grid-cols-3 gap-5 mt-8">

                <ListCard
                  title="Strengths"
                  items={feedback.strengths}
                  color="green"
                />

                <ListCard
                  title="Weaknesses"
                  items={feedback.weaknesses}
                  color="red"
                />

                <ListCard
                  title="Suggestions"
                  items={feedback.suggestions}
                  color="blue"
                />

              </div>

            </section>
          )}

        </div>

      </div>

    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>

    <p className="font-semibold mt-1">
      {value || "-"}
    </p>
  </div>
);

const ScoreCard = ({ title, score }) => (
  <div className="border rounded-lg p-5 text-center">

    <h4 className="text-gray-500">
      {title}
    </h4>

    <h2 className="text-3xl font-bold text-cyan-600 mt-2">
      {score ?? 0}
    </h2>

  </div>
);

const ListCard = ({
  title,
  items,
  color,
}) => (
  <div className="border rounded-lg p-5">

    <h4
      className={`font-semibold mb-3 text-${color}-600`}
    >
      {title}
    </h4>

    {items?.length ? (
      <ul className="list-disc list-inside space-y-2">

        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}

      </ul>
    ) : (
      <p className="text-gray-500">
        No data available
      </p>
    )}

  </div>
);

export default InterviewDetailsModal;