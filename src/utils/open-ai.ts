import { OpenAI } from "openai"; // or your preferred AI SDK

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function analyzeContentAI(
  content: File | string
): Promise<string> {
  try {
    const prompt = `Analyze the following article content and provide a short summary and an assessment if it's likely real or fake:\n\n${content}`;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.5,
    });

    const analysis = response.choices[0].message.content || "";
    return analysis.trim();
  } catch (error) {
    console.error("AI analysis error:", error);
    return "AI analysis failed.";
  }
}
