const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const isMeaningfulAnswer = (
  answer
) => {
  if (!answer) return false;

  const words = answer
    .trim()
    .split(/\s+/);

  return words.length >= 3;
};


// ===============================
// GENERATE QUESTIONS
// ===============================
const generateQuestions = async (
  role,
  experienceLevel
) => {
  try {
    const prompt = `
Generate exactly 25 technical interview questions.

Role: ${role}
Experience Level: ${experienceLevel}

Rules:
- Questions must be related ONLY to ${role}
- No HR questions
- No aptitude questions
- No behavioral questions
- Return ONLY JSON array

Example:

[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5",
  "Question 6",
  "Question 7",
  "Question 8",
  "Question 9",
  "Question 10",
  "Question 11",
  "Question 12",
  "Question 13",
  "Question 14",
  "Question 15",
  "Question 16",
  "Question 17",
  "Question 18",
  "Question 19",
  "Question 20",
  "Question 21",
  "Question 22",
  "Question 23",
  "Question 24",
  "Question 25"
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
        temperature: 0.4,
      });

    const text = cleanJSON(
      completion.choices[0].message
        .content
    );

    const parsed = JSON.parse(text);

console.log(
  "Questions Generated:",
  parsed.length
);

return parsed;
  } catch (error) {
    console.log(
      "Groq Question Error:",
      error.message
    );

return Array.from(
  { length: 25 },
  (_, index) =>
    `${role} Question ${
      index + 1
    }`
);
    
  }
};


// ===============================
// EVALUATE INTERVIEW
// ===============================
const evaluateInterview =
  async (
    role,
    questions
  ) => {
    try {

      // Count meaningful answers
      const meaningfulAnswers =
        questions.filter((q) =>
          isMeaningfulAnswer(
            q.answer
          )
        );

      // No valid answers
      if (
        meaningfulAnswers.length ===
        0
      ) {
        return {
          score: 0,
          communication: 0,
          technicalKnowledge: 0,
          problemSolving: 0,
          strengths: [],
          weaknesses: [
            "No meaningful answers provided",
          ],
          suggestions: [
            "Answer questions with proper explanations",
          ],
        };
      }

      // Very poor interview
      if (
        meaningfulAnswers.length <
        3
      ) {
        return {
          score: 10,
          communication: 10,
          technicalKnowledge: 10,
          problemSolving: 10,
          strengths: [],
          weaknesses: [
            "Most answers were too short or invalid",
          ],
          suggestions: [
            "Provide detailed technical answers",
            "Explain concepts clearly",
          ],
        };
      }

      const prompt = `
You are a STRICT technical interviewer.

Role:
${role}

Interview Questions & Answers:

${JSON.stringify(
  questions,
  null,
  2
)}

Scoring Rules:

- Empty answer = 0 marks
- Random letters/symbols = 0 marks
- Gibberish text = 0 marks
- Very short answer (<10 words) = low marks
- Incorrect answer = low marks
- Partially correct answer = medium marks
- Detailed correct answer = high marks

Evaluate honestly.

Return ONLY valid JSON:

{
  "score": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "problemSolving": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
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
          temperature: 0.1,
        });

      const text = cleanJSON(
        completion.choices[0]
          .message.content
      );

      const feedback =
        JSON.parse(text);

      return {
        score:
          Number(
            feedback.score
          ) || 0,

        communication:
          Number(
            feedback.communication
          ) || 0,

        technicalKnowledge:
          Number(
            feedback.technicalKnowledge
          ) || 0,

        problemSolving:
          Number(
            feedback.problemSolving
          ) || 0,

        strengths:
          feedback.strengths ||
          [],

        weaknesses:
          feedback.weaknesses ||
          [],

        suggestions:
          feedback.suggestions ||
          [],
      };
    } catch (error) {
      console.log(
        "Groq Feedback Error:",
        error.message
      );

      return {
        score: 0,
        communication: 0,
        technicalKnowledge: 0,
        problemSolving: 0,
        strengths: [],
        weaknesses: [
          "Interview evaluation failed",
        ],
        suggestions: [
          "Please retry the interview",
        ],
      };
    }
  };

module.exports = {
  generateQuestions,
  evaluateInterview,
};