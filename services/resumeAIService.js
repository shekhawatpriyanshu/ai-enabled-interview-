const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeWithAI =
  async (
    resumeText,
    targetRole
  ) => {
    const prompt = `
Analyze the resume.

Target Role:
${targetRole}

Resume:
${resumeText}

Return ONLY VALID JSON.

No markdown.
No explanation.

{
 "atsScore":85,
 "skillsMatch":["Java"],
 "missingSkills":["Docker"],
 "strengths":["Good Projects"],
 "weaknesses":["No Certifications"],
 "suggestions":["Add Docker"],
 "resumeSummary":"Summary",
 "experienceAnalysis":"Experience",
 "projectsAnalysis":"Projects",
 "keywordMatch":{
   "matched":18,
   "total":25
 }
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

        temperature: 0.2,
      });

    let response =
      completion.choices[0]
        .message.content;

    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

   
    return JSON.parse(
      response
    );
  };

module.exports = {
  analyzeResumeWithAI,
};