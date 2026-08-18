import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../../config/ai.config.js";

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

const MAX_SCREENSHOT_SIZE = 10 * 1024 * 1024;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

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

  return [429, 500, 502, 503, 504].includes(status);
}

function createProviderError(error) {
  const status = Number(getStatusCode(error));

  if (status === 429) {
    return new Error(
      "AI provider rate limit reached. Please try again later."
    );
  }

  if ([500, 502, 503, 504].includes(status)) {
    return new Error(
      "AI provider is temporarily unavailable. Please try again later."
    );
  }

  if (error?.message === "AI provider request timed out") {
    return new Error(
      "AI provider request timed out. Please try again."
    );
  }

  if (error?.message === "AI provider returned an empty response") {
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

  let mimeType = "image/png";
  let data = image;

  if (Buffer.isBuffer(image)) {
    if (image.length === 0) {
      throw new Error("Screenshot cannot be empty");
    }

    if (image.length > MAX_SCREENSHOT_SIZE) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }
  } else if (typeof image === "object") {
    mimeType = image.mimeType || "image/png";

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(
        "Unsupported screenshot format. Use PNG, JPEG, or WEBP."
      );
    }

    data =
      image.data ||
      image.base64 ||
      image.buffer;

    if (!data) {
      throw new Error(
        "Screenshot image data is required"
      );
    }

    const size = Buffer.isBuffer(data)
      ? data.length
      : typeof data === "string"
        ? Buffer.byteLength(data, "base64")
        : 0;

    if (size === 0) {
      throw new Error("Screenshot cannot be empty");
    }

    if (size > MAX_SCREENSHOT_SIZE) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }
  } else {
    throw new Error("Invalid screenshot input");
  }

  return {
    mimeType,
    data: Buffer.isBuffer(data)
      ? data.toString("base64")
      : data,
  };
}

async function generateWithTimeout(request) {
  const timeout = Number(aiConfig.timeout) || 30000;

  let timer;

  try {
    return await Promise.race([
      request,

      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              "AI provider request timed out"
            )
          );
        }, timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function generateScreenshotAIResponse({
  systemPrompt,
  userPrompt,
  image,
}) {
  const imagePart = normalizeImageInput(image);

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await generateWithTimeout(
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
        })
      );

      const content = response?.text?.trim();

      if (!content) {
        throw new Error(
          "AI provider returned an empty response"
        );
      }

      return content;
    } catch (error) {
      lastError = error;

      const timeout =
        error?.message ===
        "AI provider request timed out";

      if (
        !timeout &&
        !isRetryableError(error)
      ) {
        throw createProviderError(error);
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw createProviderError(lastError);
}