const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Extract only the first complete JSON object
function extractFirstJSONObject(text) {
  const start = text.indexOf("{");

  if (start === -1) {
    throw new Error("No JSON object found.");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === "{") depth++;

      if (ch === "}") {
        depth--;

        if (depth === 0) {
          return text.substring(start, i + 1);
        }
      }
    }
  }

  throw new Error("Incomplete JSON object.");
}

const generateCodingProblem = async (
  topic,
  difficulty,
  language,
  company = ""
) => {
  try {
    const prompt = `
You are an API.

Generate EXACTLY ONE coding interview problem.

Topic: ${topic}
Difficulty: ${difficulty}
Programming Language: ${language}
Company: ${company || "General"}

IMPORTANT RULES

- Generate ONLY ONE problem.
- Return ONLY ONE JSON object.
- Do NOT generate two problems.
- Do NOT generate explanations.
- Do NOT generate markdown.
- Do NOT wrap response inside \`\`\`.
- Stop immediately after the final }.

Return this exact schema:

{
  "title":"",
  "description":"",
  "difficulty":"",
  "topic":"",
  "examples":[
    {
      "input":"",
      "output":"",
      "explanation":""
    }
  ],
  "constraints":[
    ""
  ],
  "starterCode":"",
  "solution":""
}

The starterCode must be written in ${language}.

The solution must be written in ${language}.

Escape newlines using \\n.

Escape double quotes using \\".
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    let response =
      completion.choices[0].message.content;

  

    // Remove markdown if Groq adds it
    response = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract first JSON object only
    const json =
      extractFirstJSONObject(response);

   
    const parsed = JSON.parse(json);

    return parsed;
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};

module.exports = {
  generateCodingProblem,
};