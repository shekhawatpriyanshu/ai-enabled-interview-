const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateQuestions = async (
  role,
  level = "Intermediate"
) => {
  try {
    const prompt = `
Generate 10 ${level} level interview questions
for a ${role} developer.

Return ONLY JSON.

Example:
[
  {
    "question":"What is JVM?"
  }
]
`;

    const completion =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

    const response =
      completion.choices[0]
        .message.content;

    const cleanJSON = (text) => {
      let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const startArray = cleaned.indexOf("[");
      const startObj = cleaned.indexOf("{");
      let startIdx = -1;
      let endIdx = -1;

      if (startArray !== -1 && (startObj === -1 || startArray < startObj)) {
        startIdx = startArray;
        endIdx = cleaned.lastIndexOf("]") + 1;
      } else if (startObj !== -1) {
        startIdx = startObj;
        endIdx = cleaned.lastIndexOf("}") + 1;
      }

      if (startIdx !== -1 && endIdx > startIdx) {
        cleaned = cleaned.substring(startIdx, endIdx);
      }
      return cleaned;
    };

    return JSON.parse(cleanJSON(response));
  } catch (error) {
    console.error(
      "Groq Error:",
      error
    );
    throw error;
  }
};

module.exports = {
  generateQuestions,
};