import { FaPlus, FaTrash } from "react-icons/fa";

const HintInput = ({
  hints = [],
  setHints,
}) => {

  const addHint = () => {
    setHints([
      ...hints,
      "",
    ]);
  };

  const removeHint = (index) => {
    setHints(
      hints.filter((_, i) => i !== index)
    );
  };

  const handleChange = (index, value) => {
    const updated = [...hints];

    updated[index] = value;

    setHints(updated);
  };

  return (
    <div className="space-y-5">

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">
          Hints
        </h2>

        <button
          type="button"
          onClick={addHint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Hint
        </button>

      </div>

      {hints.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No hints added.
        </div>
      )}

      {hints.map((hint, index) => (

        <div
          key={index}
          className="flex gap-3"
        >

          <input
            type="text"
            value={hint}
            onChange={(e) =>
              handleChange(
                index,
                e.target.value
              )
            }
            placeholder={`Hint ${index + 1}`}
            className="flex-1 border rounded-lg p-3"
          />

          <button
            type="button"
            onClick={() =>
              removeHint(index)
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

export default HintInput;