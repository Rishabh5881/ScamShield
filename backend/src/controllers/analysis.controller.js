import {
  createAnalysis,
  getAnalysisHistory,
} from "../services/analysis.service.js";

import prisma from "../config/prisma.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:6100";

const AI_SERVICE_TIMEOUT_MS = 30000;
const AI_REQUEST_TIMEOUT_MS = 45000;
const AI_MAX_RETRIES = 3;
const AI_RETRY_DELAYS = [1000, 2000, 4000];

function isRetryableAIStatus(status) {
  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAIWithRetry(url, options, requestName = "AI") {
  let lastError = null;

  for (let attempt = 1; attempt <= AI_MAX_RETRIES; attempt++) {
    const startedAt = Date.now();
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, AI_REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `BACKEND -> ${requestName} REQUEST START`,
        {
          attempt,
          maxAttempts: AI_MAX_RETRIES,
          url,
        }
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const durationMs = Date.now() - startedAt;

      console.log(
        `BACKEND -> ${requestName} RESPONSE`,
        {
          attempt,
          status: response.status,
          ok: response.ok,
          durationMs,
        }
      );

      let payload = null;

      try {
        payload = await response.json();
      } catch {
        if (response.status === 429) {
          lastError = createAIServiceError(
            `${requestName} quota exceeded.`,
            429,
            "AI_QUOTA_EXCEEDED"
          );
        } else {
          lastError = createAIServiceError(
            `${requestName} returned invalid JSON.`,
            502,
            "AI_INVALID_RESPONSE"
          );
        }

        if (
          response.status === 429 ||
          attempt >= AI_MAX_RETRIES
        ) {
          throw lastError;
        }

        await sleep(AI_RETRY_DELAYS[attempt - 1]);
        continue;
      }

      if (response.ok) {
        if (!payload?.result) {
          lastError = createAIServiceError(
            `${requestName} returned an empty result.`,
            502,
            "AI_INVALID_RESPONSE"
          );

          if (attempt < AI_MAX_RETRIES) {
            await sleep(AI_RETRY_DELAYS[attempt - 1]);
            continue;
          }

          throw lastError;
        }

        console.log(
          `BACKEND -> ${requestName} SUCCESS`,
          {
            attempt,
            durationMs,
          }
        );

        return payload.result;
      }

      const status = response.status;

      const code =
        payload?.error?.code ||
        payload?.code ||
        "AI_SERVICE_ERROR";

      const message =
        payload?.error?.message ||
        payload?.message ||
        `${requestName} request failed.`;

      lastError = createAIServiceError(
        message,
        status,
        code
      );

      if (
        !isRetryableAIStatus(status) ||
        attempt >= AI_MAX_RETRIES
      ) {
        throw lastError;
      }

      console.warn(
        `BACKEND -> ${requestName} RETRY`,
        {
          attempt,
          nextAttempt: attempt + 1,
          status,
          code,
          delayMs: AI_RETRY_DELAYS[attempt - 1],
        }
      );

      await sleep(AI_RETRY_DELAYS[attempt - 1]);
    } catch (error) {
      clearTimeout(timeout);

      if (
        error?.status === 429 ||
        error?.code === "AI_QUOTA_EXCEEDED"
      ) {
        lastError = createAIServiceError(
          error?.message || `${requestName} quota exceeded.`,
          429,
          "AI_QUOTA_EXCEEDED"
        );
      } else if (error?.status === 503) {
        lastError = createAIServiceError(
          error?.message || `${requestName} service unavailable.`,
          503,
          "AI_SERVICE_UNAVAILABLE"
        );
      } else if (error?.name === "AbortError") {
        lastError = createAIServiceError(
          `${requestName} request timed out.`,
          504,
          "AI_TIMEOUT"
        );
      } else {
        lastError = createAIServiceError(
          error?.message || `${requestName} request failed.`,
          error?.status || 503,
          error?.code || "AI_SERVICE_UNAVAILABLE"
        );
      }

      if (attempt < AI_MAX_RETRIES) {
        await sleep(AI_RETRY_DELAYS[attempt - 1]);
        continue;
      }

      break;
    }
  }

  throw (
    lastError ||
    createAIServiceError(
      "AI service is unavailable.",
      503,
      "AI_SERVICE_UNAVAILABLE"
    )
  );
}


/**
 * Create a sanitized error while preserving
 * the AI service HTTP status and error code.
 */
function createAIServiceError(
  message,
  status = 502,
  code = "AI_SERVICE_ERROR"
) {
  const error = new Error(message);

  error.status = status;
  error.code = code;

  return error;
}

/**
 * Analyze a text message through the AI Intelligence Service.
 */
async function analyzeMessageWithAI(originalInput) {
  const url = `${AI_SERVICE_URL}/analyze`;

  console.log("Sending message to AI:", {
    url,
  });

  try {
    return await fetchAIWithRetry(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: originalInput,
        }),
      },
      "AI MESSAGE"
    );
  } catch (error) {
    console.error(
      "BACKEND -> AI MESSAGE FINAL ERROR:",
      {
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    throw error;
  }
}
async function analyzeScreenshotWithAI(file) {
  if (!file?.buffer) {
    throw createAIServiceError(
      "Screenshot file is required.",
      400,
      "SCREENSHOT_REQUIRED"
    );
  }

  const url = `${AI_SERVICE_URL}/analyze-screenshot`;

  console.log(
    "Sending screenshot to AI:",
    {
      url,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    }
  );

  try {
    const formData = new FormData();

    const blob = new Blob(
      [file.buffer],
      {
        type:
          file.mimetype ||
          "application/octet-stream",
      }
    );

    formData.append(
      "image",
      blob,
      file.originalname || "screenshot.png"
    );

    return await fetchAIWithRetry(
      url,
      {
        method: "POST",
        body: formData,
      },
      "AI SCREENSHOT"
    );
  } catch (error) {
    console.error(
      "BACKEND -> AI SCREENSHOT FINAL ERROR:",
      {
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    throw error;
  }
}
export async function createAnalysisController(
  req,
  res,
  next
) {
  try {
    /*
     * IMPORTANT:
     * Never accept an analysis result from the frontend.
     *
     * The backend obtains the authoritative result
     * from the AI Intelligence Service.
     */
    const {
      inputType,
      originalInput,
    } = req.body || {};

    if (!inputType) {
      return res.status(400).json({
        success: false,
        message:
          "inputType is required.",
      });
    }

    let analysisResult;

    /*
     * --------------------------------------
     * MESSAGE ANALYSIS
     * --------------------------------------
     */
    if (
      inputType === "message"
    ) {
      if (
        typeof originalInput !==
          "string" ||
        !originalInput.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Message is required.",
        });
      }

      if (
        originalInput.trim().length >
        10000
      ) {
        const error =
          new Error(
            "Message is too long"
          );

        error.status = 400;

        throw error;
      }

      analysisResult =
        await analyzeMessageWithAI(
          originalInput.trim()
        );
    }

    /*
     * --------------------------------------
     * SAFE STATIC URL ANALYSIS
     * --------------------------------------
     */
    else if (
      inputType === "url"
    ) {
      if (
        typeof originalInput !==
          "string" ||
        !originalInput.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "URL is required.",
        });
      }

      if (
        originalInput.trim().length >
        2048
      ) {
        const error =
          new Error(
            "URL is too long"
          );

        error.status = 400;

        throw error;
      }

      const urlResult =
        await analyzeUrlWithAI(
          originalInput.trim()
        );

      const urlRiskScore =
        urlResult.overallRiskScore ?? 0;

      let classification =
        "SAFE";

      if (urlRiskScore >= 61) {
        classification =
          "SCAM";
      } else if (
        urlRiskScore >= 31
      ) {
        classification =
          "SUSPICIOUS";
      }

      analysisResult = {
        classification,

        riskScore:
          urlRiskScore,

        confidence: 1,

        scamType:
          urlResult.detectedSignals
            ?.length > 0
            ? "Suspicious URL"
            : "None",

        severity:
          urlResult.overallSeverity ??
          "LOW",

        explanation:
          urlResult.detectedSignals
            ?.length > 0
            ? `Static URL analysis detected: ${urlResult.detectedSignals.join(", ")}.`
            : "No significant suspicious URL signals were detected.",

        redFlags:
          urlResult.detectedSignals ??
          [],

        attackPattern: [],

        recommendedActions:
          urlRiskScore >= 61
            ? [
                "Do not visit the URL.",
                "Do not enter credentials or payment information.",
                "Verify the sender through an independent channel.",
              ]
            : urlRiskScore >= 31
              ? [
                  "Treat this URL with caution.",
                  "Do not enter sensitive information.",
                  "Verify the URL through an independent source.",
                ]
              : [
                  "No significant URL risk detected.",
                ],
      };
    }

    /*
     * --------------------------------------
     * SCREENSHOT ANALYSIS
     * --------------------------------------
     */
    else if (
      inputType === "screenshot"
    ) {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Screenshot file is required.",
        });
      }

      if (req.file.size === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code:
              "SCREENSHOT_EMPTY",
            message:
              "Screenshot file cannot be empty.",
            retryable: false,
          },
        });
      }

      if (!req.file.buffer) {
        return res.status(400).json({
          success: false,
          message:
            "Uploaded screenshot data is unavailable.",
        });
      }

      analysisResult =
        await analyzeScreenshotWithAI(
          req.file
        );
    }

    /*
     * --------------------------------------
     * UNSUPPORTED INPUT TYPE
     * --------------------------------------
     */
    else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported input type.",
      });
    }

    /*
     * --------------------------------------
     * VALIDATE RESULT BEFORE DATABASE
     * --------------------------------------
     */
    if (
      !analysisResult ||
      typeof analysisResult !==
        "object"
    ) {
      throw createAIServiceError(
        "Analysis result is invalid.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    if (
      typeof analysisResult.classification !==
      "string"
    ) {
      throw createAIServiceError(
        "Analysis result is missing classification.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    /*
     * --------------------------------------
     * GUEST ANALYSIS
     * --------------------------------------
     *
     * Guest analyses are NOT saved to the
     * authenticated user's Analysis history.
     *
     * The guest only gets one successful
     * analysis.
     */
    if (req.isGuest) {
      const consumed =
        await consumeGuestAnalysis(
          req.guestId
        );

      if (!consumed) {
        return res.status(401).json({
          success: false,
          error: {
            code:
              "LOGIN_REQUIRED",
            message:
              "Your free analysis has been used. Please login or signup to continue.",
            retryable: false,
          },
        });
      }

      return res.status(201).json({
        success: true,
        isGuest: true,
        data: {
          inputType,
          originalInput:
            inputType ===
            "screenshot"
              ? req.file
                  ?.originalname ||
                "Screenshot"
              : originalInput.trim(),
          result:
            analysisResult,
        },
      });
    }

    /*
     * --------------------------------------
     * AUTHENTICATED USER
     * --------------------------------------
     *
     * Existing behavior remains unchanged.
     */
    const analysis =
      await createAnalysis({
        userId: req.user.id,
        inputType,
        originalInput:
          inputType ===
          "screenshot"
            ? req.file
                ?.originalname ||
              "Screenshot"
            : originalInput.trim(),
        result: analysisResult,
      });

    return res.status(201).json({
      success: true,
      isGuest: false,
      data: analysis,
    });
  } catch (error) {
    console.error(
      "Analysis error:",
      {
        code: error?.code,
        status: error?.status,
      }
    );

    /*
     * --------------------------------------
     * MESSAGE TOO LONG
     * --------------------------------------
     */
    if (
      error?.message ===
      "Message is too long"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message is too long. Maximum length is 10000 characters.",
      });
    }

    /*
     * --------------------------------------
     * URL TOO LONG
     * --------------------------------------
     */
    if (
      error?.message ===
      "URL is too long"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "URL is too long. Maximum length is 2048 characters.",
      });
    }

    /*
     * --------------------------------------
     * INVALID URL
     * --------------------------------------
     */
    if (
      error?.message ===
        "Invalid URL" ||
      error?.code ===
        "INVALID_URL"
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code:
            "INVALID_URL",
          message:
            "The supplied URL is invalid.",
          retryable: false,
        },
      });
    }

    /*
     * --------------------------------------
     * AI QUOTA / RATE LIMIT
     * --------------------------------------
     */
    if (
      error?.status === 429 ||
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      return res.status(429).json({
        success: false,
        error: {
          code:
            "AI_QUOTA_EXCEEDED",
          message:
            "AI analysis is temporarily unavailable because the AI provider quota has been reached.",
          retryable: true,
        },
      });
    }

    /*
     * --------------------------------------
     * AI SERVICE UNAVAILABLE
     * --------------------------------------
     */
    if (
      error?.status === 503 ||
      error?.code ===
        "AI_SERVICE_UNAVAILABLE"
    ) {
      return res.status(503).json({
        success: false,
        error: {
          code:
            "AI_SERVICE_UNAVAILABLE",
          message:
            "AI analysis service is temporarily unavailable. Please try again later.",
          retryable: true,
        },
      });
    }

    /*
     * --------------------------------------
     * INVALID AI RESPONSE
     * --------------------------------------
     */
    if (
      error?.status === 502 ||
      error?.code ===
        "AI_INVALID_RESPONSE"
    ) {
      return res.status(502).json({
        success: false,
        error: {
          code:
            "AI_INVALID_RESPONSE",
          message:
            "AI analysis returned an invalid response. Please try again.",
        retryable: true,
        },
      });
    }

    /*
     * --------------------------------------
     * OTHER UNEXPECTED ANALYSIS ERROR
     * --------------------------------------
     */
    console.error(
      "Analysis failed with an unexpected error."
    );

    return res.status(500).json({
      success: false,
      error: {
        code:
          "ANALYSIS_FAILED",
        message:
          "Unable to complete analysis.",
        retryable: true,
      },
    });
  }
}

/**
 * Get authenticated user's analysis history.
 *
 * This remains protected and does not
 * modify the guest analysis flow.
 */
export async function getAnalysisHistoryController(
  req,
  res
) {
  try {
    const history =
      await getAnalysisHistory(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch analysis history.",
    });
  }
}



async function analyzeUrlWithAI(originalInput) {
  const url = `${AI_SERVICE_URL}/analyze`;

  console.log("Sending URL to AI:", {
    url,
    originalInput,
  });

  try {
    return await fetchAIWithRetry(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: originalInput,
        }),
      },
      "AI URL"
    );
  } catch (error) {
    console.error(
      "BACKEND -> AI URL FINAL ERROR:",
      {
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    throw error;
  }
}


