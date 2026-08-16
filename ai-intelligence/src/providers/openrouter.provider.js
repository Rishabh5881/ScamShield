import OpenAI from "openai";
import { aiConfig } from "../config/ai.config.js";

const client = new OpenAI({
  apiKey: aiConfig.apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  timeout: aiConfig.timeout,
});

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  const response = await client.chat.completions.create({
    model: aiConfig.model,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response");
  }

  return content;
}