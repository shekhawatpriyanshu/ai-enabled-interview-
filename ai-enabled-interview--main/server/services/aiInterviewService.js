const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
Generate exactly 50 multiple choice questions (MCQs) for a technical interview.

Role: ${role}
Experience Level: ${experienceLevel}

Rules:
- Questions must be related ONLY to ${role}
- No HR questions
- No aptitude questions
- No behavioral questions
- Each question must have exactly 4 options.
- Provide the exact correct option string in "correctAnswer".
- Return ONLY a JSON object containing a "questions" array.

Example:
{
  "questions": [
    {
      "question": "Sample Question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    },
    {
      "question": "Sample Question 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
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
        temperature: 0.4,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      });

    const text = cleanJSON(
      completion.choices[0].message
        .content
    );

    const parsed = JSON.parse(text);

let finalQuestions = parsed.questions || parsed;
if (!Array.isArray(finalQuestions)) {
  finalQuestions = [];
}

// Slice if more than 50
if (finalQuestions.length > 50) {
  finalQuestions = finalQuestions.slice(0, 50);
}

// Pad if less than 50
while (finalQuestions.length < 50) {
  finalQuestions.push({
    question: `${role} Technical Question ${finalQuestions.length + 1}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A"
  });
}

console.log(
  "Questions Generated:",
  finalQuestions.length
);

return finalQuestions;
  } catch (error) {
    console.log(
      "Groq Question Error:",
      error.message
    );
return Array.from(
  { length: 50 },
  (_, index) => ({
    question: `${role} Question ${index + 1}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A"
  })
);
  }
};


// ===============================
// EVALUATE INTERVIEW
// ===============================
const evaluateInterview = async (
  role,
  questions
) => {
  try {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((q) => {
      if (q.answer && q.answer === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Construct local feedback instead of using AI
    return {
      score: Math.round(percentage),
      communication: Math.round(percentage), 
      technicalKnowledge: Math.round(percentage),
      problemSolving: Math.round(percentage),
      strengths: percentage > 70 ? ["Good understanding of technical concepts", "Accurate answers"] : ["Attempted the questions"],
      weaknesses: percentage < 70 ? ["Needs improvement in core concepts", "Many incorrect answers"] : ["Minor knowledge gaps"],
      suggestions: ["Review incorrect options", "Practice more MCQs in this domain"],
    };
  } catch (error) {
    console.error("Evaluation Error:", error);
    return {
      score: 0,
      communication: 0,
      technicalKnowledge: 0,
      problemSolving: 0,
      strengths: [],
      weaknesses: ["Error during evaluation"],
      suggestions: ["Please try again"],
    };
  }
};


module.exports = {
  generateQuestions,
  evaluateInterview,
};