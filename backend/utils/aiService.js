import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSuggestion = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI career mentor for students. Give structured learning suggestions with roadmap, skills, daily plan, and motivation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.message);

    return `
AI Suggestion (Fallback Mode):

📘 Roadmap:
- Learn fundamentals
- Practice DSA daily
- Build projects
- Learn full stack development

⚠️ AI service temporarily unavailable.
`;
  }
};