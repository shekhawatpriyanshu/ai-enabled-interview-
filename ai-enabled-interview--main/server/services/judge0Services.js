const axios = require("axios");

const languageMap = {
  javascript: 102, // Node.js 22
  python: 100,     // Python 3.12
  java: 91,        // Java 17
  cpp: 105,        // GCC 14
  c: 103,          // GCC 14
};

const executeCode = async ({
  code,
  language,
  input = "",
}) => {
  const languageId = languageMap[language];

  if (!languageId) {
    throw new Error("Unsupported language");
  }

  const { data } = await axios.post(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      source_code: code,
      language_id: languageId,
      stdin: input,
    }
  );

  return {
    statusId: data.status?.id,
    status: data.status?.description,
    stdout: data.stdout || "",
    stderr: data.stderr || "",
    compileOutput: data.compile_output || "",
    runtime: data.time ? `${data.time} s` : "--",
    memory: data.memory ? `${data.memory} KB` : "--",
  };
};

module.exports = {
  executeCode,
};