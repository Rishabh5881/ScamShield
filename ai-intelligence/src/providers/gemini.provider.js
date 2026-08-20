import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../config/ai.config.js";

const ai = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 60000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================
// ERROR HELPERS
// ==========================================

function getStatusCode(error) {
  const candidates = [
    error?.status,
    error?.code,
    error?.error?.code,
    error?.response?.status,
  ];

  for (const value of candidates) {
    const number = Number(value);

    if (
      Number.isFinite(number) &&
      number >= 100 &&
      number <= 599
    ) {
      return number;
    }
  }

  return null;
}

function getErrorMessage(error) {
  return String(
    error?.message ||
      error?.error?.message ||
      ""
  );
}

function getErrorDetails(error) {
  return {
    name: error?.name,
    message: error?.message,
    status: error?.status,
    code: error?.code,
    responseStatus:
      error?.response?.status,
  };
}

// ==========================================
// QUOTA DETECTION
// ==========================================

function isDailyQuotaExceeded(error) {
  const message =
    getErrorMessage(error);

  return (
    message.includes(
      "GenerateRequestsPerDayPerProject-FreeTier"
    ) ||
    message.includes(
      "generate_content_free_tier_requests"
    ) ||
    (
      message.includes(
        "Quota exceeded for metric"
      ) &&
      message.includes(
        "PerDayPerProject"
      )
    )
  );
}

// ==========================================
// RETRY DELAY
// ==========================================

function getRetryDelayMs(error) {
  const message =
    getErrorMessage(error);

  /*
   * Gemini commonly returns:
   *
   * retryDelay":"39s"
   */

  const retryDelayMatch =
    message.match(
      /retryDelay["']?\s*:\s*["'](\d+(?:\.\d+)?)s["']/
    );

  if (retryDelayMatch) {
    const seconds =
      Number(
        retryDelayMatch[1]
      );

    if (
      Number.isFinite(seconds)
    ) {
      return Math.min(
        Math.max(
          seconds * 1000,
          RETRY_DELAY_MS
        ),
        MAX_RETRY_DELAY_MS
      );
    }
  }

  return RETRY_DELAY_MS;
}

// ==========================================
// RETRY POLICY
// ==========================================

function isRetryableError(error) {
  const status =
    getStatusCode(error);

  /*
   * Daily quota cannot be fixed
   * by retrying.
   */
  if (
    status === 429 &&
    isDailyQuotaExceeded(error)
  ) {
    return false;
  }

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

// ==========================================
// PROVIDER ERROR
// ==========================================

function createProviderError(error) {
  const status =
    getStatusCode(error);

  let providerError;

  // ----------------------------------------
  // AUTH
  // ----------------------------------------

  if (
    status === 401 ||
    status === 403
  ) {
    providerError =
      new Error(
        "Gemini API authentication failed. Check GEMINI_API_KEY."
      );

    providerError.code =
      "AI_PROVIDER_AUTH_ERROR";

    providerError.status =
      502;

    providerError.retryable = true;

    return providerError;
  }

  // ----------------------------------------
  // MODEL NOT FOUND
  // ----------------------------------------

  if (status === 404) {
    providerError =
      new Error(
        `Gemini model "${aiConfig.model}" was not found or is unavailable.`
      );

    providerError.code =
      "AI_MODEL_NOT_FOUND";

    providerError.status =
      502;

    providerError.retryable = false;

    return providerError;
  }

  // ----------------------------------------
  // 429 QUOTA / RATE LIMIT
  // ----------------------------------------

  if (status === 429) {
    if (
      isDailyQuotaExceeded(error)
    ) {
      providerError =
        new Error(
          "AI daily quota has been reached. Please try again later or use another Gemini API project/model with available quota."
        );

      /*
       * IMPORTANT:
       * Preserve 429 all the way to
       * the backend and frontend.
       */
      providerError.code =
        "AI_QUOTA_EXCEEDED";

      providerError.status =
        429;

      providerError.retryable =
        false;

      return providerError;
    }

    providerError =
      new Error(
        "AI provider rate limit reached. Please try again later."
      );

    providerError.code =
      "AI_RATE_LIMITED";

    providerError.status =
      429;

    providerError.retryable =
      true;

    return providerError;
  }

  // ----------------------------------------
  // PROVIDER TEMPORARILY UNAVAILABLE
  // ----------------------------------------

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    providerError =
      new Error(
        "AI provider is temporarily unavailable. Please try again later."
      );

    providerError.code =
      "AI_PROVIDER_UNAVAILABLE";

    providerError.status =
      503;

    providerError.retryable =
      true;

    return providerError;
  }

  // ----------------------------------------
  // TIMEOUT
  // ----------------------------------------

  if (
    error?.message ===
    "AI provider request timed out"
  ) {
    providerError =
      new Error(
        "AI provider request timed out. Please try again."
      );

    providerError.code =
      "AI_PROVIDER_TIMEOUT";

    providerError.status =
      504;

    providerError.retryable =
      true;

    return providerError;
  }

  // ----------------------------------------
  // EMPTY RESPONSE
  // ----------------------------------------

  if (
    error?.message ===
    "AI provider returned an empty response"
  ) {
    providerError =
      new Error(
        "AI provider returned an empty response."
      );

    providerError.code =
      "AI_EMPTY_RESPONSE";

    providerError.status =
      502;

    providerError.retryable =
      true;

    return providerError;
  }

  // ----------------------------------------
  // DEFAULT
  // ----------------------------------------

  providerError =
    new Error(
      error?.message ||
        "AI provider request failed."
    );

  providerError.code =
    "AI_PROVIDER_ERROR";

  providerError.status =
    status || 502;

  providerError.retryable =
    false;

  return providerError;
}

// ==========================================
// GENERATE AI RESPONSE
// ==========================================

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  let lastError = null;

  console.log(
    "GEMINI REQUEST:",
    {
      model: aiConfig.model,
      timeout: aiConfig.timeout,
      hasApiKey:
        Boolean(aiConfig.apiKey),
    }
  );

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `GEMINI ATTEMPT ${attempt}/${MAX_RETRIES}`
      );

      const response =
        await Promise.race([
          ai.models.generateContent({
            model: aiConfig.model,
            contents: userPrompt,
            config: {
              systemInstruction:
                systemPrompt,

              temperature: 0.2,

              responseMimeType:
                "application/json",
            },
          }),

          new Promise(
            (_, reject) => {
              setTimeout(() => {
                reject(
                  new Error(
                    "AI provider request timed out"
                  )
                );
              }, aiConfig.timeout);
            }
          ),
        ]);

      const content =
        response?.text;

      if (!content) {
        throw new Error(
          "AI provider returned an empty response"
        );
      }

      console.log(
        "GEMINI RESPONSE RECEIVED"
      );

      return content;
    } catch (error) {
      lastError = error;

      console.error(
        `GEMINI ATTEMPT ${attempt} FAILED:`,
        getErrorDetails(error)
      );

      const status =
        getStatusCode(error);

      const isTimeout =
        error?.message ===
        "AI provider request timed out";

      // --------------------------------------
      // DAILY QUOTA
      // --------------------------------------

      if (
        status === 429 &&
        isDailyQuotaExceeded(error)
      ) {
        console.error(
          "GEMINI DAILY QUOTA EXCEEDED - NO RETRY"
        );

        throw createProviderError(
          error
        );
      }

      // --------------------------------------
      // NON-RETRYABLE
      // --------------------------------------

      if (
        !isRetryableError(error) &&
        !isTimeout
      ) {
        throw createProviderError(
          error
        );
      }

      // --------------------------------------
      // RETRY
      // --------------------------------------

      if (
        attempt < MAX_RETRIES
      ) {
        let delayMs =
          RETRY_DELAY_MS *
          attempt;

        if (status === 429) {
          delayMs =
            getRetryDelayMs(
              error
            );
        }

        console.log(
          `GEMINI RETRYING IN ${delayMs}ms...`
        );

        await sleep(
          delayMs
        );
      }
    }
  }

  console.error(
    "GEMINI FINAL ERROR:",
    getErrorDetails(
      lastError
    )
  );

  throw createProviderError(
    lastError
  );
}