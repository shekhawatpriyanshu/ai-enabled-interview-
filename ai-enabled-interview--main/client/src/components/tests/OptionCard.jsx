import { FaCheckCircle } from "react-icons/fa";

const OptionCard = ({
  option,
  index,
  selected,
  onSelect,
}) => {
  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left
      ${
        selected
          ? "border-cyan-600 bg-cyan-50 shadow-md"
          : "border-gray-200 bg-white hover:border-cyan-400 hover:bg-cyan-50"
      }`}
    >
      {/* Option Letter */}

      <div
        className={`h-11 w-11 rounded-full flex items-center justify-center font-bold transition
        ${
          selected
            ? "bg-cyan-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {optionLabels[index]}
      </div>

      {/* Option Text */}

      <div className="flex-1">

        <p className="text-gray-800 text-lg whitespace-pre-wrap">
          {option}
        </p>

      </div>

      {/* Selected Tick */}

      {selected && (
        <FaCheckCircle
          size={24}
          className="text-cyan-600 mt-1"
        />
      )}
    </button>
  );
};

export default OptionCard;