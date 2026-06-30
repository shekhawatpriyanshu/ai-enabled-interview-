import { Link } from "react-router-dom";
import {
  FileCode2,
  ExternalLink,
} from "lucide-react";

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const ProblemList = ({ problems = [] }) => {
  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
        <FileCode2
          className="mx-auto text-gray-400"
          size={50}
        />

        <h2 className="mt-4 text-xl font-semibold">
          No Problems Available
        </h2>

        <p className="text-gray-500 mt-2">
          This contest doesn't contain any coding problems yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">
          Contest Problems
        </h2>

      </div>

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">
                #
              </th>

              <th className="text-left px-6 py-4">
                Problem
              </th>

              <th className="text-left px-6 py-4">
                Difficulty
              </th>

              <th className="text-right px-6 py-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {problems.map((problem, index) => {

              const letter = String.fromCharCode(
                65 + index
              );

              return (
                <tr
                  key={problem._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-5 font-semibold">
                    {letter}
                  </td>

                  <td className="px-6 py-5">

                    <p className="font-medium">
                      {problem.title}
                    </p>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        difficultyColors[
                          problem.difficulty
                        ] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {problem.difficulty ||
                        "N/A"}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-right">

                    <Link
                      to={`/coding/${problem._id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Solve

                      <ExternalLink size={16} />
                    </Link>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="md:hidden">

        {problems.map((problem, index) => {

          const letter = String.fromCharCode(
            65 + index
          );

          return (
            <div
              key={problem._id}
              className="border-t p-5"
            >

              <div className="flex justify-between">

                <h3 className="font-semibold">
                  {letter}. {problem.title}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    difficultyColors[
                      problem.difficulty
                    ] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {problem.difficulty ||
                    "N/A"}
                </span>

              </div>

              <Link
                to={`/coding/${problem._id}`}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Solve

                <ExternalLink size={16} />
              </Link>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default ProblemList;