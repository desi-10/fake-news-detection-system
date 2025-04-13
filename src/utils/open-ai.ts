import { GoogleGenAI } from "@google/genai";
import { FactCheckResult } from "./fact-check";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const analyzeContentAI = async (content: FactCheckResult[]) => {
  console.log(content);
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: `Analyze the following article content and provide a short summary and an assessment if it's likely real or fake:\n\n${JSON.stringify(
      content,
      null,
      2
    )} and return the result in JSON format. The JSON should have the following format: \n\n{
    facts: boolean,
    claims: boolean,
    factsConfidence: number,
    claimsConfidence: number,
    summary: string,
    explanation: string,
    sources: { publisher: string; url: string; rating: string }[]
  }`,
  });

  return response.text;
};

export default analyzeContentAI;
