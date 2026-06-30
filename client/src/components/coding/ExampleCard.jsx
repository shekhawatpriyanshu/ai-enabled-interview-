const ExampleCard = ({
  example,
  index,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 mb-5">

      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Example {index + 1}
      </h3>

      {/* Input */}

      <div className="mb-4">

        <p className="font-semibold text-gray-700 mb-2">
          Input
        </p>

        <pre className="bg-slate-900 text-green-400 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
{example.input}
        </pre>

      </div>

      {/* Output */}

      <div className="mb-4">

        <p className="font-semibold text-gray-700 mb-2">
          Output
        </p>

        <pre className="bg-slate-900 text-cyan-400 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
{example.output}
        </pre>

      </div>

      {/* Explanation */}

      {example.explanation && (
        <div>

          <p className="font-semibold text-gray-700 mb-2">
            Explanation
          </p>

          <div className="bg-slate-100 rounded-xl p-4 text-gray-700 leading-7">
            {example.explanation}
          </div>

        </div>
      )}

    </div>
  );
};

export default ExampleCard;