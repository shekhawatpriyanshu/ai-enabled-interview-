import { FaListUl } from "react-icons/fa";

const ConstraintCard = ({ constraints = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="bg-cyan-100 p-3 rounded-full">
          <FaListUl className="text-cyan-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Constraints
          </h2>

          <p className="text-sm text-gray-500">
            Problem limitations and input ranges.
          </p>
        </div>

      </div>

      {constraints.length === 0 ? (
        <p className="text-gray-500">
          No constraints available.
        </p>
      ) : (
        <ul className="space-y-3">

          {constraints.map((constraint, index) => (

            <li
              key={index}
              className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border"
            >

              <span className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </span>

              <span className="text-gray-700 leading-7">
                {constraint}
              </span>

            </li>

          ))}

        </ul>
      )}

    </div>
  );
};

export default ConstraintCard;