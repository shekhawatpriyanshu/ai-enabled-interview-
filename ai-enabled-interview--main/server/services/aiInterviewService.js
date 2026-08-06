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
Generate exactly 20 multiple choice questions (MCQs) for a technical interview.

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

// Slice if more than 20
if (finalQuestions.length > 20) {
  finalQuestions = finalQuestions.slice(0, 20);
}

// Pad if less than 20
while (finalQuestions.length < 20) {
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
  { length: 20 },
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


// ===============================
// ADAPTIVE CODING QUESTIONS
// ===============================
const generateAdaptiveCodingQuestions = async (role, experienceLevel, pastTitles = []) => {
  try {
    const avoidPrompt = pastTitles.length > 0 
      ? `\nCRITICAL RULE: The candidate has ALREADY solved the following questions in past interviews: ${pastTitles.join(", ")}. DO NOT generate these questions again. You MUST generate entirely NEW questions.`
      : "";

    const prompt = `
Generate exactly 2 coding questions for a ${role} (${experienceLevel} level).
One must be a Data Structures & Algorithms (DSA) question.
One must be a practical implementation problem related to ${role}.
${avoidPrompt}

Return a JSON object with a "codingQuestions" array.
Each object must contain:
- problemTitle (String)
- problemDescription (String)
- starterCode (String, JavaScript)
- testCases (Array of objects with "input" and "output" strings)

Example JSON:
{
  "codingQuestions": [
    {
      "problemTitle": "Two Sum",
      "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "starterCode": "function solve(nums, target) {\\n\\n}",
      "testCases": [
        { "input": "[2,7,11,15]\\n9", "output": "[0,1]" }
      ]
    },
    {
      "problemTitle": "Debounce Function",
      "problemDescription": "Implement a debounce function...",
      "starterCode": "function solve(delay) {\\n\\n}",
      "testCases": [
        { "input": "...", "output": "..." }
      ]
    }
  ]
}
`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });
    const parsed = JSON.parse(cleanJSON(completion.choices[0].message.content));
    return parsed.codingQuestions || [];
  } catch (error) {
    console.error("Coding Gen Error:", error);
    return [];
  }
};

// ===============================
// VOICE INTERVIEW QUESTIONS
// ===============================
const generateVoiceQuestions = async (role, resumeDetails, mcqMistakes, codingMistakes) => {
  try {
    const prompt = `
Generate a list of 15 personalized interview questions (7 Technical, 8 HR) for a ${role}.
Context:
Resume: ${JSON.stringify(resumeDetails)}
MCQ Mistakes: ${JSON.stringify(mcqMistakes)}
Coding Mistakes: ${JSON.stringify(codingMistakes)}

Make the questions conversational and adaptive based on their mistakes.
Return JSON ONLY:
{
  "technicalQuestions": ["Question 1...", "Question 2...", "Question 3..."],
  "hrQuestions": ["HR 1...", "HR 2..."]
}
`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });
    return JSON.parse(cleanJSON(completion.choices[0].message.content));
  } catch (error) {
    console.error("Voice Gen Error:", error);
    return {
      technicalQuestions: [
        "Tell me about a technical challenge you faced.", 
        "Explain a core concept of your tech stack.", 
        "How do you optimize performance?",
        "Describe your experience with debugging complex issues.",
        "How do you ensure your code is secure and maintainable?",
        "What is your approach to testing?",
        "Can you explain a recent technology you learned?"
      ],
      hrQuestions: [
        "Tell me about yourself.", 
        "Where do you see yourself in 5 years?",
        "Describe a time you disagreed with a team member.",
        "How do you handle tight deadlines?",
        "What is your greatest professional achievement?",
        "Why do you want to work here?",
        "How do you prioritize your tasks?",
        "Describe your ideal work environment."
      ]
    };
  }
};

// ===============================
// HANDLE VOICE CHAT (Conversational)
// ===============================
const handleVoiceChat = async (role, transcript, mcqScore, codingScore) => {
  try {
    const conversationHistory = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    
    const prompt = `
You are an expert AI Interviewer for a ${role} role. 
The candidate has completed the first two rounds of the interview process.
Their Round 1 (MCQ) score was ${mcqScore}%.
Their Round 2 (Coding) score was ${codingScore}%.

Your goal is to conduct a conversational interview by asking a mix of Technical and HR questions.
Here is the conversation so far:
${conversationHistory}

Based on the conversation above, provide your next statement or question.
Rules:
1. Speak directly to the candidate as a professional interviewer.
2. If the conversation is just starting, introduce yourself and ask the first question.
3. Keep your responses concise and conversational (1-3 sentences max).
4. Acknowledge their previous answer before asking the next question.
5. Do NOT include prefixes like "AI: " or quotes. Just output the raw text you want spoken.
6. ALWAYS respond exclusively in the English language.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are an AI Interviewer." }, { role: "user", content: prompt }],
      temperature: 0.6,
    });
    
    let text = completion.choices[0].message.content.trim();
    // Clean up any stray quotes or speaker prefixes just in case
    text = text.replace(/^AI:\s*/i, "").replace(/^Interviewer:\s*/i, "").replace(/^"|"$/g, "").trim();
    
    return text;
  } catch (error) {
    console.error("Voice Chat Gen Error:", error);
    return "Could you please elaborate on that?";
  }
};


// ===============================
// EVALUATE COMPREHENSIVE INTERVIEW
// ===============================
const evaluateComprehensiveInterview = async (
  role,
  mcqScore,
  codingScore,
  voiceTranscript
) => {
  try {
    const prompt = `
Evaluate the candidate's performance across a multi-round interview for the role of ${role}.
MCQ Score: ${mcqScore}%
Coding Score: ${codingScore}%
Voice Transcript: ${JSON.stringify(voiceTranscript)}

Generate a detailed evaluation. Return ONLY JSON:
{
  "score": 85, // Overall score (0-100)
  "communication": 80,
  "technicalKnowledge": 85,
  "problemSolving": 90,
  "leadership": 75,
  "grammar": 85,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "suggestions": ["Suggestion 1"],
  "learningRoadmap": {
    "week1": "Topic",
    "week2": "Topic",
    "week3": "Topic",
    "week4": "Topic"
  },
  "recommendedLevel": "L1 Software Engineer",
  "probabilityOfSelection": 75
}
`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });
    return JSON.parse(cleanJSON(completion.choices[0].message.content));
  } catch (error) {
    console.error("Evaluation Gen Error:", error);
    return {
      score: Math.round((mcqScore + codingScore) / 2),
      communication: 70,
      technicalKnowledge: mcqScore,
      problemSolving: codingScore,
      leadership: 70,
      grammar: 70,
      strengths: ["Completed the interview rounds"],
      weaknesses: ["Unable to generate detailed feedback at this time"],
      suggestions: ["Keep practicing"],
      learningRoadmap: { week1: "Basics", week2: "Intermediate", week3: "Advanced", week4: "Projects" },
      recommendedLevel: "Entry Level",
      probabilityOfSelection: 50
    };
  }
};

module.exports = {
  generateQuestions,
  evaluateInterview,
  generateAdaptiveCodingQuestions,
  generateVoiceQuestions,
  handleVoiceChat,
  evaluateComprehensiveInterview,
};