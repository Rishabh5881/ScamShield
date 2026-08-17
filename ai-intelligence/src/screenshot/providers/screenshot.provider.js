import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../../config/ai.config.js";

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

  if (
    error?.message ===
    "AI provider request timed out"
  ) {
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

  return new Error("AI screenshot analysis failed.");
}

function normalizeImageInput(image) {
  if (!image) {
    throw new Error("Screenshot is required");
  }

  if (Buffer.isBuffer(image)) {
    return {
      mimeType: "image/png",
      data: image.toString("base64"),
    };
  }

  if (typeof image === "object") {
    const mimeType =
      image.mimeType || "image/png";

    const data =
      image.data ||
      image.base64 ||
      image.buffer;

    if (!data) {
      throw new Error(
        "Screenshot image data is required"
      );
    }

    return {
      mimeType,
      data: Buffer.isBuffer(data)
        ? data.toString("base64")
        : data,
    };
  }

  throw new Error(
    "Invalid screenshot input"
  );
}

export async function generateScreenshotAIResponse({
  systemPrompt,
  userPrompt,
  image,
}) {
  const imagePart = normalizeImageInput(image);

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: aiConfig.model,

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userPrompt,
                },
                {
                  inlineData: imagePart,
                },
              ],
            },
          ],

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

      return content;
    } catch (error) {
      lastError = error;

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
        await sleep(
          RETRY_DELAY_MS * attempt
        );
      }
    }
  }

  throw createProviderError(lastError);
}