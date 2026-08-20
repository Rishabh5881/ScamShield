import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../../config/ai.config.js";

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

const MAX_SCREENSHOT_SIZE = 10 * 1024 * 1024;
const REQUEST_TIMEOUT =
  Number(process.env.AI_TIMEOUT_MS) || 60000;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

function normalizeImageInput(image) {
  if (!image) {
    throw new Error("Screenshot is required.");
  }

  let mimeType = "image/png";
  let data = image;

  if (Buffer.isBuffer(image)) {
    if (image.length === 0) {
      throw new Error("Screenshot cannot be empty.");
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
        "Screenshot image data is required."
      );
    }

    const size = Buffer.isBuffer(data)
      ? data.length
      : typeof data === "string"
        ? Buffer.byteLength(data, "base64")
        : 0;

    if (size === 0) {
      throw new Error(
        "Screenshot cannot be empty."
      );
    }

    if (size > MAX_SCREENSHOT_SIZE) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }
  } else {
    throw new Error(
      "Invalid screenshot input."
    );
  }

  return {
    mimeType,
    data: Buffer.isBuffer(data)
      ? data.toString("base64")
      : data,
  };
}

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.error?.message ||
    error?.response?.data?.error?.message ||
    "AI screenshot analysis failed."
  );
}

function getStatusCode(error) {
  return Number(
    error?.status ||
    error?.statusCode ||
    error?.code ||
    error?.error?.code ||
    error?.response?.status ||
    0
  );
}

function createProviderError(error) {
  const status = getStatusCode(error);
  const message = getErrorMessage(error);

  console.error(
    "========== SCREENSHOT AI ERROR =========="
  );

  console.error("Status:", status);
  console.error("Message:", message);
  console.error(error);

  console.error(
    "=========================================="
  );

  if (status === 400) {
    return new Error(
      `AI provider rejected the screenshot request: ${message}`
    );
  }

  if (status === 401 || status === 403) {
    return new Error(
      "AI provider authentication failed. Check the Gemini API key."
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

  if (
    message
      .toLowerCase()
      .includes("timeout")
  ) {
    return new Error(
      "AI screenshot analysis timed out after 90 seconds."
    );
  }

  return new Error(message);
}

async function generateWithTimeout(request) {
  return Promise.race([
    request,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "AI provider request timed out."
          )
        );
      }, REQUEST_TIMEOUT);
    }),
  ]);
}

export async function generateScreenshotAIResponse({
  systemPrompt,
  userPrompt,
  image,
}) {
  const imagePart =
    normalizeImageInput(image);

  console.log(
    "========== SCREENSHOT AI REQUEST =========="
  );

  console.log(
    "Model:",
    aiConfig.model
  );

  console.log(
    "MIME:",
    imagePart.mimeType
  );

  console.log(
    "Image base64 size:",
    imagePart.data.length
  );

  try {
    const response =
      await generateWithTimeout(
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
                  inlineData: {
                    mimeType:
                      imagePart.mimeType,

                    data:
                      imagePart.data,
                  },
                },
              ],
            },
          ],

          config: {
            systemInstruction:
              systemPrompt,

            temperature: 0.2,

            responseMimeType:
              "application/json",
          },
        })
      );

    const content =
      response?.text?.trim();

    if (!content) {
      throw new Error(
        "AI provider returned an empty response."
      );
    }

    console.log(
      "SCREENSHOT AI RESPONSE RECEIVED"
    );

    console.log(
      "=========================================="
    );

    return content;
  } catch (error) {
    throw createProviderError(error);
  }
}