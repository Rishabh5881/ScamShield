import {
  screenshotSystemPrompt,
  buildScreenshotUserPrompt,
} from "../prompts/screenshot.prompt.js";

import {
  generateScreenshotAIResponse,
} from "../providers/screenshot.provider.js";

import {
  validateScreenshotAnalysis,
} from "../schemas/screenshot-analysis.schema.js";

const MAX_SCREENSHOT_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

function validateImage(image) {
  if (!image) {
    throw new Error("Screenshot is required");
  }

  if (Buffer.isBuffer(image)) {
    if (image.length === 0) {
      throw new Error("Screenshot cannot be empty");
    }

    if (image.length > MAX_SCREENSHOT_SIZE) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }

    return;
  }

  if (typeof image === "object") {
    const data =
      image.data ||
      image.base64 ||
      image.buffer;

    if (!data) {
      throw new Error(
        "Screenshot image data is required"
      );
    }

    if (Buffer.isBuffer(data)) {
      if (data.length === 0) {
        throw new Error(
          "Screenshot cannot be empty"
        );
      }

      if (data.length > MAX_SCREENSHOT_SIZE) {
        throw new Error(
          "Screenshot is too large. Maximum size is 10MB."
        );
      }
    }

    return;
  }

  throw new Error("Invalid screenshot input");
}

function validateMimeType(image) {
  if (!image || typeof image !== "object") {
    return;
  }

  const mimeType =
    image.mimeType || "image/png";

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(
      "Unsupported screenshot format. Use PNG, JPEG, or WEBP."
    );
  }
}

function parseAIResponse(rawResponse) {
  let parsed;

  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error(
      "AI returned invalid screenshot JSON"
    );
  }

  const validation =
    validateScreenshotAnalysis(parsed);

  if (!validation.success) {
    throw new Error(
      "AI screenshot response failed schema validation"
    );
  }

  return validation.data;
}

export async function analyzeScreenshot(image) {
  validateImage(image);
  validateMimeType(image);

  const rawResponse =
    await generateScreenshotAIResponse({
      systemPrompt: screenshotSystemPrompt,
      userPrompt: buildScreenshotUserPrompt(),
      image,
    });

  const aiResult =
    parseAIResponse(rawResponse);

  return {
    classification: aiResult.classification,
    riskScore: aiResult.riskScore,
    confidence: aiResult.confidence,
    scamType: aiResult.scamType,
    severity: aiResult.severity,
    redFlags: aiResult.redFlags,
    attackPattern: aiResult.attackPattern,
    explanation: aiResult.explanation,
    recommendedActions: aiResult.recommendedActions,

    assessment:
      "AI-assisted screenshot assessment. This result is not an absolute guarantee.",
  };
}

