import "dotenv/config";

export const aiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  timeout: Number(process.env.AI_TIMEOUT_MS || 30000),
};