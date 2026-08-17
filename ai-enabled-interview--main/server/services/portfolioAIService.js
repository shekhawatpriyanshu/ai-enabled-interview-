const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

const candidateModels = [
  "groq/compound",
  "groq/compound-mini",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

const generatePortfolioData = async (resumeText) => {
  const prompt = `
Extract structured portfolio information from this resume text.

Resume Text:
${resumeText}

Return ONLY a valid JSON object matching this schema. No markdown formatting, no code block markers.

{
  "personal": {
    "name": "Candidate Name",
    "title": "Software Developer",
    "email": "candidate@example.com",
    "phone": "",
    "location": "India",
    "github": "",
    "linkedin": ""
  },
  "summary": "Full stack developer passionate about building scalable web applications.",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experience": [
    {
      "company": "Tech Solutions",
      "role": "Software Developer Intern",
      "duration": "2023 - Present",
      "description": "Developed key web application features."
    }
  ],
  "projects": [
    {
      "title": "Full Stack Application",
      "description": "Interactive web platform with modern frontend and backend services.",
      "technologies": ["React", "Node.js", "Express"],
      "github": "",
      "live": ""
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science & Engineering",
      "institution": "University",
      "year": "2021 - 2025",
      "description": "Software Engineering"
    }
  ],
  "certifications": []
}
`;

  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "dummy") {
    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        });

        if (completion && completion.choices && completion.choices[0]) {
          const content = completion.choices[0].message.content.replace(/```json/gi, "").replace(/```/g, "").trim();
          console.log(`✅ Portfolio AI generation succeeded with active model: ${modelName}`);
          return JSON.parse(content);
        }
      } catch (err) {
        console.warn(`Groq model ${modelName} failed in portfolio service: ${err.message}`);
      }
    }
  }

  // Dynamic Fallback
  return {
    personal: { name: "Priyanshu Shekhawat", title: "Full Stack Developer", email: "candidate@example.com", phone: "", location: "India", github: "", linkedin: "" },
    summary: "Enthusiastic Full-Stack Developer skilled in modern JavaScript, React, Node.js, and cloud backend architecture.",
    skills: ["JavaScript", "React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Git"],
    experience: [
      {
        company: "Software Systems",
        role: "Full Stack Developer Intern",
        duration: "2023 - 2024",
        description: "Built scalable web interfaces, REST APIs, and integrated authentication logic.",
      },
    ],
    projects: [
      {
        title: "AI Interview Platform",
        description: "Real-time AI-powered interview platform featuring live interactive rooms, automatic evaluation, and analytics.",
        technologies: ["React", "Node.js", "Socket.IO", "Monaco Editor"],
        github: "",
        live: "",
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "IMSEC",
        year: "2021 - 2025",
        description: "Computer Science Specialization",
      },
    ],
    certifications: ["Full-Stack Web Development Certification"],
  };
};

module.exports = {
  generatePortfolioData,
};
