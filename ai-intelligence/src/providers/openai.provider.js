import OpenAI from "openai";
import { aiConfig } from "../config/ai.config.js";

if (!aiConfig.apiKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}

const openai = new OpenAI({
  apiKey: aiConfig.apiKey,
  timeout: aiConfig.timeout,
});

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  const response = await openai.chat.completions.create({
    model: aiConfig.model,
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
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