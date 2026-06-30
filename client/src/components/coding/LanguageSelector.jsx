const languages = [
  {
    label: "JavaScript",
    value: "javascript",
  },
  {
    label: "Java",
    value: "java",
  },
  {
    label: "Python",
    value: "python",
  },
  {
    label: "C++",
    value: "cpp",
  },
  {
    label: "C",
    value: "c",
  },
];

const LanguageSelector = ({
  language,
  setLanguage,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">

      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Programming Language
        </h3>

        <p className="text-sm text-gray-500">
          Select the language for your solution.
        </p>
      </div>

      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
        className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
      >
        {languages.map((lang) => (
          <option
            key={lang.value}
            value={lang.value}
          >
            {lang.label}
          </option>
        ))}
      </select>

    </div>
  );
};

export default LanguageSelector;