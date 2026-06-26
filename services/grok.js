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

    return JSON.parse(response);
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