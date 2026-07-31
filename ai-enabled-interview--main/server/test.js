const Groq = require('groq-sdk');
require('dotenv').config({ path: './.env' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prompt = `Generate exactly 50 multiple choice questions (MCQs) for a technical interview.

Role: Java
Experience Level: Fresher

Rules:
- Questions must be related ONLY to Java
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
    }
  ]
}`;

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: 'json_object' }
    });
    console.log('Success! Length:', completion.choices[0].message.content.length);
    console.log(completion.choices[0].message.content.substring(0, 200));
  } catch (e) {
    console.error('Groq Error:', e);
  }
}
test();
