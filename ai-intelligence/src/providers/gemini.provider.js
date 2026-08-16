import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../config/ai.config.js";

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  const response = await ai.models.generateContent({
    model: aiConfig.model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error("AI provider returned an empty response");
  }

  return content;
}