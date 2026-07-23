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
    let existingTitles = [];
    try {
      const CodingProblem = require("../models/codingProblem");
      const existing = await CodingProblem.find({ topic }).select("title").lean();
      existingTitles = existing.map(p => p.title);
    } catch (e) {
      console.warn("Could not fetch existing coding problem titles for uniqueness:", e);
    }

    const randomSeed = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

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
${existingTitles.length > 0 ? `- Do NOT generate any coding problem with the following titles: ${existingTitles.join(", ")}` : ""}
- Ensure the coding problem is unique, creative, and distinct from any previously generated common/classic programming questions.
- Use this random variant seed to differentiate the problem structure: ${randomSeed}

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

Ensure the response is a valid, parseable JSON object. Any double quotes inside string fields must be escaped as \", and any newlines inside string fields must be escaped as \n. Do not output raw unescaped newlines or unescaped quotes inside JSON string values.

`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.85,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
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