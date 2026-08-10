const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generatePortfolioData = async (resumeText) => {
  try {
    const prompt = `
Extract structured portfolio information from this resume text.

Resume Text:
${resumeText}

Return ONLY a valid JSON object matching this schema. No markdown formatting, no code block markers.

{
  "personal": {
    "name": "Candidate Name",
    "title": "Professional Title / Role",
    "email": "candidate@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "summary": "Professional summary or bio...",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "duration": "2022 - Present",
      "description": "Key achievements and responsibilities"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project overview",
      "technologies": ["React", "Node.js"],
      "github": "",
      "live": ""
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "University Name",
      "year": "2020 - 2024",
      "description": "Honors or GPA details"
    }
  ],
  "certifications": ["AWS Certified Developer"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    let content = completion.choices[0]?.message?.content || "{}";
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("AI Portfolio Data Generation Error:", error);
    return {
      personal: { name: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "" },
      summary: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
    };
  }
};

module.exports = {
  generatePortfolioData,
};
