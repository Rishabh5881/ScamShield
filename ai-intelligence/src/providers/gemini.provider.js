import { aiConfig } from "../config/ai.config.js";

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
    error?.statusCode,
    error?.code,
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
// RETRY POLICY
// ==========================================

function isRetryableError(error) {
  const status =
    getStatusCode(error);

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

// ==========================================
// RETRY DELAY
// ==========================================

function getRetryDelayMs(error) {
  const message =
    getErrorMessage(error);

  const retryDelayMatch =
    message.match(
      /retryDelay["']?\s*:\s*["'](\d+(?:\.\d+)?)s["']/
    );

  if (retryDelayMatch) {
    const seconds =
      Number(retryDelayMatch[1]);

    if (Number.isFinite(seconds)) {
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
// PROVIDER ERROR
// ==========================================

function createProviderError(error) {
  const status =
    getStatusCode(error);

  const message =
    getErrorMessage(error);

  let providerError;

  // ----------------------------------------
  // AUTH / FORBIDDEN
  // ----------------------------------------

  if (
    status === 401 ||
    status === 403
  ) {
    providerError =
      new Error(
        "NaraRouter authentication or access failed. Check NARA_API_KEY and account access."
      );

    providerError.code =
      "AI_PROVIDER_AUTH_ERROR";

    providerError.status =
      502;

    providerError.retryable =
      false;

    return providerError;
  }

  // ----------------------------------------
  // MODEL NOT FOUND
  // ----------------------------------------

  if (status === 404) {
    providerError =
      new Error(
        `NaraRouter model "${aiConfig.model}" was not found or is unavailable.`
      );

    providerError.code =
      "AI_MODEL_NOT_FOUND";

    providerError.status =
      502;

    providerError.retryable =
      false;

    return providerError;
  }

  // ----------------------------------------
  // RATE LIMIT / QUOTA
  // ----------------------------------------

  if (status === 429) {
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
    message ===
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
    message ===
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
      message ||
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
// NARAROUTER REQUEST
// ==========================================

async function generateNaraResponse({
  systemPrompt,
  userPrompt,
}) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, aiConfig.timeout);

  try {
    const response =
      await fetch(
        `${aiConfig.baseUrl}/chat/completions`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${aiConfig.apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model:
              aiConfig.model,

            messages: [
              {
                role: "system",
                content:
                  systemPrompt,
              },
              {
                role: "user",
                content:
                  userPrompt,
              },
            ],

            temperature: 0.2,

            response_format: {
              type: "json_object",
            },
          }),

          signal:
            controller.signal,
        }
      );

    const responseText =
      await response.text();

    if (!response.ok) {
      let errorData;

      try {
        errorData =
          JSON.parse(responseText);
      } catch {
        errorData = null;
      }

      const providerError =
        new Error(
          errorData?.error?.message ||
            responseText ||
            "NaraRouter request failed."
        );

      providerError.status =
        response.status;

      providerError.response = {
        status:
          response.status,
        data:
          errorData,
      };

      throw providerError;
    }

    let data;

    try {
      data =
        JSON.parse(responseText);
    } catch {
      throw new Error(
        "NaraRouter returned invalid JSON."
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "AI provider returned an empty response"
      );
    }

    return content;
  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      throw new Error(
        "AI provider request timed out"
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// ==========================================
// GENERATE AI RESPONSE
// ==========================================

export async function generateAIResponse({
  systemPrompt,
  userPrompt,
}) {
  let lastError = null;

  console.log("NARAROUTER REQUEST:", { model: aiConfig.model, timeout: aiConfig.timeout });

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `NARAROUTER ATTEMPT ${attempt}/${MAX_RETRIES}`
      );

      const content =
        await generateNaraResponse({
          systemPrompt,
          userPrompt,
        });

      console.log(
        "NARAROUTER RESPONSE RECEIVED"
      );

      return content;
    } catch (error) {
      lastError =
        error;

      console.error(`NARAROUTER ATTEMPT ${attempt} FAILED:`, { code: error?.code, status: getStatusCode(error) });

      const status =
        getStatusCode(error);

      const isTimeout =
        error?.message ===
        "AI provider request timed out";

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

        if (
          status === 429
        ) {
          delayMs =
            getRetryDelayMs(
              error
            );
        }

        console.log(
          `NARAROUTER RETRYING IN ${delayMs}ms...`
        );

        await sleep(
          delayMs
        );
      }
    }
  }

  console.error("NARAROUTER FINAL ERROR:", { code: lastError?.code, status: getStatusCode(lastError) });

  throw createProviderError(
    lastError
  );
}



