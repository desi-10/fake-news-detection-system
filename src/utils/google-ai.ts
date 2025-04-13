import { GoogleGenAI } from "@google/genai";
import { FactCheckResult } from "./fact-check";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const analyzeContentAI = async (article: string, facts: FactCheckResult[]) => {
  const prompt = `
You are an AI assistant helping to verify the truthfulness of an article using Google Fact Check data.

Here is the article content:
""" 
${article}
"""

Here are the fact-check results:
${JSON.stringify(facts, null, 2)}

Instructions:
1. Analyze the article in relation to the fact-check data.
2. Determine if the article appears to be real or fake.
3. Summarize the article briefly.
4. Explain your reasoning using evidence from the fact-check results.
5. Provide a list of sources that support your assessment.

Return your response strictly in the following JSON format:

{
  "isLikelyTrue": boolean,
  "confidence": number,
  "summary": string,
  "explanation": string,
  "sources": [
    {
      "publisher": string,
      "url": string,
      "rating": "True" | "False" | "Misleading" | "Unverified"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return response.text;
};

export default analyzeContentAI;
