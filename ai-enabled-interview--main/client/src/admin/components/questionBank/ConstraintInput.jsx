import { FaPlus, FaTrash } from "react-icons/fa";

const ConstraintInput = ({
  constraints = [],
  setConstraints,
}) => {

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      "",
    ]);
  };

  const removeConstraint = (index) => {
    setConstraints(
      constraints.filter((_, i) => i !== index)
    );
  };

  const handleChange = (index, value) => {
    const updated = [...constraints];

    updated[index] = value;

    setConstraints(updated);
  };

  return (
    <div className="space-y-5">

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">
          Constraints
        </h2>

        <button
          type="button"
          onClick={addConstraint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Constraint
        </button>

      </div>

      {constraints.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No constraints added.
        </div>
      )}

      {constraints.map((constraint, index) => (

        <div
          key={index}
          className="flex gap-3"
        >

          <input
            type="text"
            value={constraint}
            onChange={(e) =>
              handleChange(
                index,
                e.target.value
              )
            }
            placeholder={`Constraint ${index + 1}`}
            className="flex-1 border rounded-lg p-3"
          />

          <button
            type="button"
            onClick={() =>
              removeConstraint(index)
            }
            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
          >
            <FaTrash />
          </button>

        </div>

      ))}

    </div>
  );
};

export default ConstraintInput;