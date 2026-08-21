const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "gsk_placeholder_key_for_server_boot",
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

// ==========================================
// Retry Groq Request
// ==========================================

const candidateModels = [
  "openai/gpt-oss-20b",
  "groq/compound-mini",
  "qwen/qwen3.6-27b",
  "groq/compound",
  "openai/gpt-oss-120b",
];

async function requestGroq(prompt) {
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        temperature: 0.85,
        max_tokens: 4096,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (
        completion &&
        completion.choices &&
        completion.choices.length
      ) {
        console.log(`✅ Coding AI succeeded with model: ${modelName}`);
        return completion;
      }

    } catch (err) {
      lastError = err;
      console.warn(
        `Groq model ${modelName} failed:`,
        err.message
      );
    }
  }

  throw lastError || new Error("All candidate models failed for coding AI");
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

    const completion = await requestGroq(prompt);

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

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
      throw new Error(
        "Groq returned invalid JSON."
      );
    }

    if (!parsed.solution) {
      throw new Error(
        "Solution missing."
      );
    }

    if (
      parsed.solution.length < 20
    ) {
      throw new Error(
        "Generated solution is too short."
      );
    }

    parsed.topic = topic;
    parsed.difficulty = difficulty;
    parsed.company = company || "General";

    parsed.generatedAt = new Date();
    parsed.aiModel = "llama-3.3-70b-versatile";
    parsed.version = 1;

    return normalizeProblem(parsed);
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};

// ==========================================
// Validation Helpers
// ==========================================

const VALID_TYPES = [
  "int",
  "string",
  "boolean",
  "intArray",
  "stringArray",
  "ListNode",
  "TreeNode",
];

function normalizeType(type = "") {
  const t = String(type).trim();

  const map = {
    "int[]": "intArray",
    "integer[]": "intArray",
    "array<int>": "intArray",
    "vector<int>": "intArray",
    "list<int>": "intArray",
    "List<Integer>": "intArray",

    "string[]": "stringArray",
    "array<string>": "stringArray",
    "vector<string>": "stringArray",
    "List<String>": "stringArray",

    integer: "int",
    Integer: "int",
    bool: "boolean",
    Boolean: "boolean",
  };

  return map[t] || t;
}

function validateParameter(param) {
  return {
    name:
      param?.name ||
      `param${Math.floor(Math.random() * 1000)}`,

    type: VALID_TYPES.includes(normalizeType(param?.type))
      ? normalizeType(param.type)
      : "string",
  };
}

function validateExample(example = {}) {
  return {
    input:
      typeof example.input === "string"
        ? example.input.trim()
        : "",

    output:
      typeof example.output === "string"
        ? example.output.trim()
        : "",

    explanation:
      typeof example.explanation === "string"
        ? example.explanation.trim()
        : "",
  };
}

function normalizeHelperClasses(problem) {
  const helpers = [];

  if (
    problem.returnType === "ListNode" ||
    (problem.parameters && problem.parameters.some(
      (p) => p.type === "ListNode"
    ))
  ) {
    helpers.push("ListNode");
  }

  if (
    problem.returnType === "TreeNode" ||
    (problem.parameters && problem.parameters.some(
      (p) => p.type === "TreeNode"
    ))
  ) {
    helpers.push("TreeNode");
  }

  return [...new Set(helpers)];
}

function normalizeProblem(problem) {
  problem.title =
    String(problem.title || "").trim();

  problem.description =
    String(problem.description || "").trim();

  problem.topic =
    String(problem.topic || "").trim();

  problem.difficulty =
    String(problem.difficulty || "").trim();

  problem.functionName =
    String(problem.functionName || "solve").trim();

  //-----------------------------------------
  // Parameters
  //-----------------------------------------
  if (!Array.isArray(problem.parameters)) {
    problem.parameters = [];
  }
  problem.parameters =
    problem.parameters.map(validateParameter);

  //-----------------------------------------
  // Return Type
  //-----------------------------------------
  problem.returnType =
    normalizeType(problem.returnType);

  if (!VALID_TYPES.includes(problem.returnType)) {
    problem.returnType = "string";
  }

  //-----------------------------------------
  // Examples
  //-----------------------------------------
  if (!Array.isArray(problem.examples)) {
    problem.examples = [];
  }
  problem.examples =
    problem.examples.map(validateExample);

  //-----------------------------------------
  // Constraints
  //-----------------------------------------
  if (!Array.isArray(problem.constraints)) {
    problem.constraints = [];
  }
  problem.constraints =
    problem.constraints
      .map(String)
      .filter(Boolean);

  //-----------------------------------------
  // Helper Classes
  //-----------------------------------------
  problem.helperClasses =
    normalizeHelperClasses(problem);

  //-----------------------------------------
  // Solution
  //-----------------------------------------
  problem.solution =
    String(problem.solution || "").trim();

  return problem;
}

module.exports = {
  generateCodingProblem,
};