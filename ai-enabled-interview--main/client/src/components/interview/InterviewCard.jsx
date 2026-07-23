import { Link } from "react-router-dom";

const InterviewCard = ({
  interview,
}) => {
  return (
    <Link
      to={`/interviews/${interview._id}`}
      className="block bg-white rounded-2xl shadow hover:shadow-xl transition p-6 border border-slate-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-mono  text-slate-800">
            {interview.role}
          </h2>

          <p className="text-slate-500 mt-2">
            {interview.experienceLevel}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            interview.status ===
            "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {interview.status}
        </span>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        Questions:
        {" "}
        {
          interview.questions
            ?.length
        }
      </div>
    </Link>
  );
};

export default InterviewCard;