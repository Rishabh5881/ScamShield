import { analyzeUrls } from "./url-intelligence.service.js";

export function analyzeSingleUrl(input) {
  // Input validation
  if (!input || typeof input !== "string") {
    const error = new Error("URL is required.");
    error.code = "INVALID_URL";
    error.status = 400;
    throw error;
  }

  const trimmedUrl = input.trim();

  if (!trimmedUrl) {
    const error = new Error("URL is required.");
    error.code = "INVALID_URL";
    error.status = 400;
    throw error;
  }

  if (trimmedUrl.length > 2048) {
    const error = new Error("URL is too long.");
    error.code = "INVALID_URL";
    error.status = 400;
    throw error;
  }

  // Only static URL analysis.
  // IMPORTANT: This does NOT visit/request the URL.
  let parsedUrl;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    const error = new Error("Invalid URL format.");
    error.code = "INVALID_URL";
    error.status = 400;
    throw error;
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    const error = new Error(
      "Only HTTP and HTTPS URLs are supported."
    );

    error.code = "INVALID_URL";
    error.status = 400;

    throw error;
  }

  const result = analyzeUrls(trimmedUrl);

  const analyzedUrl = result.urls?.[0] || null;

  return {
    ...result,
    analyzedUrl,
  };
}