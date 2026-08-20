import "dotenv/config";

export const aiConfig = {
  apiKey: process.env.NARA_API_KEY,

  baseUrl:
    process.env.NARA_BASE_URL ||
    "https://router.bynara.id/v1",

  model:
    process.env.NARA_MODEL ||
    "agnes-2.5-flash",

  visionModel:
    process.env.NARA_VISION_MODEL ||
    "agnes-2.5-flash",

  timeout:
    Number(process.env.AI_TIMEOUT_MS || 60000),
};