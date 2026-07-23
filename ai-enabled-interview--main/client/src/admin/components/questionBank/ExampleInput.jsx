import { FaPlus, FaTrash } from "react-icons/fa";

const ExampleInput = ({
  examples = [],
  setExamples,
}) => {

  const addExample = () => {
    setExamples([
      ...examples,
      {
        input: "",
        output: "",
        explanation: "",
      },
    ]);
  };

  const removeExample = (index) => {
    const updated = examples.filter(
      (_, i) => i !== index
    );

    setExamples(updated);
  };

  const handleChange = (
    index,
    field,
    value
  ) => {
    const updated = [...examples];

    updated[index][field] = value;

    setExamples(updated);
  };

  return (
    <div className="space-y-5">

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">
          Examples
        </h2>

        <button
          type="button"
          onClick={addExample}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FaPlus />

          Add Example
        </button>

      </div>

      {examples.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No examples added.
        </div>
      )}

      {examples.map((example, index) => (

        <div
          key={index}
          className="border rounded-xl p-5 bg-gray-50 space-y-4"
        >

          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              Example {index + 1}
            </h3>

            <button
              type="button"
              onClick={() =>
                removeExample(index)
              }
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>

          </div>

          {/* Input */}

          <div>

            <label className="font-medium block mb-2">
              Input
            </label>

            <textarea
              rows={3}
              value={example.input}
              onChange={(e) =>
                handleChange(
                  index,
                  "input",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          {/* Output */}

          <div>

            <label className="font-medium block mb-2">
              Output
            </label>

            <textarea
              rows={3}
              value={example.output}
              onChange={(e) =>
                handleChange(
                  index,
                  "output",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          {/* Explanation */}

          <div>

            <label className="font-medium block mb-2">
              Explanation
            </label>

            <textarea
              rows={4}
              value={example.explanation}
              onChange={(e) =>
                handleChange(
                  index,
                  "explanation",
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

      ))}

    </div>
  );
};

export default ExampleInput;