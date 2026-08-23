import { aiConfig } from "../../config/ai.config.js";

const MAX_SCREENSHOT_SIZE =
  10 * 1024 * 1024;

const REQUEST_TIMEOUT =
  Number(aiConfig.timeout) || 60000;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 60000;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

// ==========================================
// HELPERS
// ==========================================

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeImageInput(image) {
  if (!image) {
    throw new Error(
      "Screenshot is required."
    );
  }

  let mimeType = "image/png";
  let data = image;

  // ----------------------------------------
  // BUFFER INPUT
  // ----------------------------------------

  if (Buffer.isBuffer(image)) {
    if (image.length === 0) {
      throw new Error(
        "Screenshot cannot be empty."
      );
    }

    if (
      image.length >
      MAX_SCREENSHOT_SIZE
    ) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }
  }

  // ----------------------------------------
  // OBJECT INPUT
  // ----------------------------------------

  else if (
    typeof image === "object"
  ) {
    mimeType =
      image.mimeType ||
      "image/png";

    if (
      !ALLOWED_MIME_TYPES.includes(
        mimeType
      )
    ) {
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

    const size =
      Buffer.isBuffer(data)
        ? data.length
        : typeof data === "string"
          ? Buffer.byteLength(
              data,
              "base64"
            )
          : 0;

    if (size === 0) {
      throw new Error(
        "Screenshot cannot be empty."
      );
    }

    if (
      size >
      MAX_SCREENSHOT_SIZE
    ) {
      throw new Error(
        "Screenshot is too large. Maximum size is 10MB."
      );
    }
  }

  // ----------------------------------------
  // INVALID INPUT
  // ----------------------------------------

  else {
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

// ==========================================
// ERROR HELPERS
// ==========================================

function getErrorMessage(error) {
  return String(
    error?.message ||
      error?.error?.message ||
      error?.response?.data?.error
        ?.message ||
      "AI screenshot analysis failed."
  );
}

function getStatusCode(error) {
  const candidates = [
    error?.status,
    error?.statusCode,
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

  return 0;
}

function getErrorDetails(error) {
  return {
    name: error?.name,
    message: getErrorMessage(error),
    status: getStatusCode(error),
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

  /*
   * Supports provider responses such as:
   *
   * retryDelay":"5s"
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
// PROVIDER ERROR
// ==========================================

function createProviderError(error) {
  const status =
    getStatusCode(error);

  const message =
    getErrorMessage(error);

  console.error("SCREENSHOT AI ERROR:", { code: error?.code, status });

  // ----------------------------------------
  // BAD REQUEST
  // ----------------------------------------

  if (status === 400) {
    const providerError =
      new Error(
        `AI provider rejected the screenshot request: ${message}`
      );

    providerError.code =
      "AI_SCREENSHOT_BAD_REQUEST";

    providerError.status = 400;
    providerError.retryable = false;

    return providerError;
  }

  // ----------------------------------------
  // AUTH / ACCESS
  // ----------------------------------------

  if (
    status === 401 ||
    status === 403
  ) {
    const providerError =
      new Error(
        "NaraRouter authentication or access failed. Check NARA_API_KEY and account access."
      );

    providerError.code =
      "AI_PROVIDER_AUTH_ERROR";

    providerError.status = 502;
    providerError.retryable = false;

    return providerError;
  }

  // ----------------------------------------
  // MODEL NOT FOUND
  // ----------------------------------------

  if (status === 404) {
    const providerError =
      new Error(
        `NaraRouter screenshot model "${aiConfig.visionModel}" was not found or is unavailable.`
      );

    providerError.code =
      "AI_MODEL_NOT_FOUND";

    providerError.status = 502;
    providerError.retryable = false;

    return providerError;
  }

  // ----------------------------------------
  // IMAGE TOO LARGE
  // ----------------------------------------

  if (status === 413) {
    const providerError =
      new Error(
        "Screenshot is too large for the AI provider."
      );

    providerError.code =
      "AI_IMAGE_TOO_LARGE";

    providerError.status = 413;
    providerError.retryable = false;

    return providerError;
  }

  // ----------------------------------------
  // RATE LIMIT / QUOTA
  // ----------------------------------------

  if (status === 429) {
    const providerError =
      new Error(
        "AI provider rate limit reached. Please try again later."
      );

    providerError.code =
      "AI_RATE_LIMITED";

    providerError.status = 429;
    providerError.retryable = true;

    return providerError;
  }

  // ----------------------------------------
  // TEMPORARY PROVIDER ERROR
  // ----------------------------------------

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    const providerError =
      new Error(
        "AI provider is temporarily unavailable. Please try again later."
      );

    providerError.code =
      "AI_PROVIDER_UNAVAILABLE";

    providerError.status = 503;
    providerError.retryable = true;

    return providerError;
  }

  // ----------------------------------------
  // TIMEOUT
  // ----------------------------------------

  if (
    message
      .toLowerCase()
      .includes("timed out")
  ) {
    const providerError =
      new Error(
        `AI screenshot analysis timed out after ${REQUEST_TIMEOUT}ms.`
      );

    providerError.code =
      "AI_PROVIDER_TIMEOUT";

    providerError.status = 504;
    providerError.retryable = true;

    return providerError;
  }

  // ----------------------------------------
  // EMPTY RESPONSE
  // ----------------------------------------

  if (
    message ===
    "AI provider returned an empty response."
  ) {
    const providerError =
      new Error(
        "AI provider returned an empty response."
      );

    providerError.code =
      "AI_EMPTY_RESPONSE";

    providerError.status = 502;
    providerError.retryable = true;

    return providerError;
  }

  // ----------------------------------------
  // DEFAULT
  // ----------------------------------------

  const providerError =
    new Error(
      message
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
// NARAROUTER SCREENSHOT REQUEST
// ==========================================

async function generateNaraScreenshotResponse({
  systemPrompt,
  userPrompt,
  imagePart,
}) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

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
              aiConfig.visionModel,

            messages: [
              {
                role: "system",

                content:
                  systemPrompt,
              },

              {
                role: "user",

                content: [
                  {
                    type: "text",

                    text:
                      userPrompt,
                  },

                  {
                    type: "image_url",

                    image_url: {
                      url:
                        `data:${imagePart.mimeType};base64,${imagePart.data}`,
                    },
                  },
                ],
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

    // --------------------------------------
    // PROVIDER HTTP ERROR
    // --------------------------------------

    if (!response.ok) {
      let errorData = null;

      try {
        errorData =
          JSON.parse(
            responseText
          );
      } catch {
        // Keep raw provider response.
      }

      const providerError =
        new Error(
          errorData?.error?.message ||
            responseText ||
            "NaraRouter screenshot request failed."
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

    // --------------------------------------
    // PARSE RESPONSE
    // --------------------------------------

    let data;

    try {
      data =
        JSON.parse(
          responseText
        );
    } catch {
      throw new Error(
        "NaraRouter returned invalid JSON."
      );
    }

    // --------------------------------------
    // EXTRACT CONTENT
    // --------------------------------------

    const content =
      data
        ?.choices?.[0]
        ?.message
        ?.content;

    if (!content) {
      throw new Error(
        "AI provider returned an empty response."
      );
    }

    return content;
  } catch (error) {
    // --------------------------------------
    // ABORT / TIMEOUT
    // --------------------------------------

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
// PUBLIC API
// ==========================================

export async function generateScreenshotAIResponse({
  systemPrompt,
  userPrompt,
  image,
}) {
  // ----------------------------------------
  // CONFIG VALIDATION
  // ----------------------------------------

  if (!aiConfig.apiKey) {
    throw new Error(
      "NARA_API_KEY is not configured."
    );
  }

  if (!aiConfig.baseUrl) {
    throw new Error(
      "NARA_BASE_URL is not configured."
    );
  }

  if (!aiConfig.visionModel) {
    throw new Error(
      "NARA_VISION_MODEL is not configured."
    );
  }

  // ----------------------------------------
  // IMAGE VALIDATION
  // ----------------------------------------

  const imagePart =
    normalizeImageInput(image);

  // ----------------------------------------
  // REQUEST LOG
  // ----------------------------------------

  console.log(
    "========== SCREENSHOT AI REQUEST =========="
  );

  console.log(
    "Provider: NaraRouter"
  );

  console.log(
    "Model:",
    aiConfig.visionModel
  );

  console.log(
    "MIME:",
    imagePart.mimeType
  );

  console.log(
    "Image base64 size:",
    imagePart.data.length
  );

  console.log(
    "Timeout:",
    REQUEST_TIMEOUT
  );

  console.log(
    "=========================================="
  );

  let lastError = null;

  // ----------------------------------------
  // RETRY LOOP
  // ----------------------------------------

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `SCREENSHOT AI ATTEMPT ${attempt}/${MAX_RETRIES}`
      );

      const content =
        await generateNaraScreenshotResponse({
          systemPrompt,
          userPrompt,
          imagePart,
        });

      console.log(
        "SCREENSHOT AI RESPONSE RECEIVED"
      );

      console.log(
        "=========================================="
      );

      return content;
    } catch (error) {
      lastError =
        error;

      console.error(`SCREENSHOT AI ATTEMPT ${attempt} FAILED:`, { code: error?.code, status: getStatusCode(error) });

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
          `SCREENSHOT AI RETRYING IN ${delayMs}ms...`
        );

        await sleep(
          delayMs
        );
      }
    }
  }

  // ----------------------------------------
  // FINAL ERROR
  // ----------------------------------------

  console.error("SCREENSHOT AI FINAL ERROR:", { code: lastError?.code, status: getStatusCode(lastError) });

  throw createProviderError(
    lastError
  );
}




