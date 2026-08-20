import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../config/ai.config.js";

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatusCode(error) {
  return (
    error?.status ??
    error?.code ??
    error?.error?.code ??
    error?.response?.status ??
    null
  );
}

function getErrorDetails(error) {
  return {
    name: error?.name,
    message: error?.message,
    status: error?.status,
    code: error?.code,
    cause: error?.cause,
    responseStatus: error?.response?.status,
  };
}

function isRetryableError(error) {
  const status = Number(getStatusCode(error));

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function createProviderError(error) {
  const status = Number(getStatusCode(error));

  if (status === 401 || status === 403) {
    return new Error(
      "Gemini API authentication failed. Check GEMINI_API_KEY."
    );
  }

  if (status === 404) {
    return new Error(
      `Gemini model "${aiConfig.model}" was not found or is unavailable.`
    );
  }

  if (status === 429) {
    return new Error(
      "AI provider rate limit reached. Please try again later."
    );
  }

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return new Error(
      "AI provider is temporarily unavailable. Please try again later."
    );
  }

  if (error?.message === "AI provider request timed out") {
    return new Error(
      "AI provider request timed out. Please try again."
    );
  }

  if (
    error?.message ===
    "AI provider returned an empty response"
  ) {
    return new Error(
      "AI provider returned an empty response."
    );
  }

  return new Error(
    error?.message ||
      "AI provider request failed."
  );
}

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  let lastError;

  console.log("GEMINI REQUEST:", {
    model: aiConfig.model,
    timeout: aiConfig.timeout,
    hasApiKey: Boolean(aiConfig.apiKey),
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `GEMINI ATTEMPT ${attempt}/${MAX_RETRIES}`
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: aiConfig.model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),

        new Promise((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                "AI provider request timed out"
              )
            );
          }, aiConfig.timeout);
        }),
      ]);

      const content = response?.text;

      if (!content) {
        throw new Error(
          "AI provider returned an empty response"
        );
      }

      console.log("GEMINI RESPONSE RECEIVED");

      return content;
    } catch (error) {
      lastError = error;

      console.error(
        `GEMINI ATTEMPT ${attempt} FAILED:`,
        getErrorDetails(error)
      );

      const isTimeout =
        error?.message ===
        "AI provider request timed out";

      if (
        !isRetryableError(error) &&
        !isTimeout
      ) {
        throw createProviderError(error);
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(
    "GEMINI FINAL ERROR:",
    getErrorDetails(lastError)
  );

  throw createProviderError(lastError);
}