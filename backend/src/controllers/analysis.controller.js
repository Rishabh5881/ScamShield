import {
  createAnalysis,
  getAnalysisHistory,
} from "../services/analysis.service.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:6100";

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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: originalInput,
      }),
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      throw createAIServiceError(
        "AI service returned an invalid response.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    if (!response.ok) {
      const status = response.status;

      const code =
        payload?.error?.code ||
        payload?.code ||
        "AI_SERVICE_ERROR";

      const message =
        payload?.error?.message ||
        payload?.message ||
        "AI service request failed.";

      throw createAIServiceError(
        message,
        status,
        code
      );
    }

    if (!payload?.result) {
      throw createAIServiceError(
        "AI service returned an empty analysis result.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    return payload.result;
  } catch (error) {
    console.error(
      "BACKEND → AI MESSAGE ERROR:",
      {
        name: error?.name,
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    if (
      error?.status ||
      error?.code === "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

    throw createAIServiceError(
      "Could not connect to AI service.",
      503,
      "AI_SERVICE_UNAVAILABLE"
    );
  }
}

/**
 * Analyze a URL through the SAFE STATIC URL pipeline.
 *
 * IMPORTANT:
 * The user supplied URL is NEVER requested.
 *
 * The only network request here is to our own
 * local AI Intelligence Service.
 */
async function analyzeUrlWithAI(originalInput) {
  const url =
    `${AI_SERVICE_URL}/analyze-url`;

  try {
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          url: originalInput,
        }),
      }
    );

    let payload = null;

    try {
      payload =
        await response.json();
    } catch {
      throw createAIServiceError(
        "AI URL service returned an invalid response.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    if (!response.ok) {
      throw createAIServiceError(
        payload?.error?.message ||
          "AI URL analysis failed.",
        response.status,
        payload?.error?.code ||
          "AI_SERVICE_ERROR"
      );
    }

    if (!payload?.result) {
      throw createAIServiceError(
        "AI URL service returned an empty result.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    return payload.result;
  } catch (error) {
    console.error(
      "BACKEND → AI URL STATIC ANALYSIS ERROR:",
      {
        name: error?.name,
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    if (
      error?.status ||
      error?.code
    ) {
      throw error;
    }

    throw createAIServiceError(
      "Could not connect to AI URL service.",
      503,
      "AI_SERVICE_UNAVAILABLE"
    );
  }
}

/**
 * Analyze a screenshot through the AI Intelligence Service.
 *
 * The original uploaded file is converted to a Blob and sent
 * as multipart/form-data using the field name expected by
 * the AI service: "image".
 */
async function analyzeScreenshotWithAI(file) {
  if (!file?.buffer) {
    throw createAIServiceError(
      "Screenshot file is required.",
      400,
      "SCREENSHOT_REQUIRED"
    );
  }

  const url =
    `${AI_SERVICE_URL}/analyze-screenshot`;

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
      file.originalname ||
        "screenshot.png"
    );

    const response = await fetch(
      url,
      {
        method: "POST",
        body: formData,
      }
    );

    let payload = null;

    try {
      payload =
        await response.json();
    } catch {
      throw createAIServiceError(
        "AI screenshot service returned an invalid response.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    if (!response.ok) {
      const status =
        response.status;

      const code =
        payload?.error?.code ||
        payload?.code ||
        "AI_SERVICE_ERROR";

      const message =
        payload?.error?.message ||
        payload?.message ||
        "AI screenshot service request failed.";

      throw createAIServiceError(
        message,
        status,
        code
      );
    }

    if (!payload?.result) {
      throw createAIServiceError(
        "AI screenshot service returned an empty analysis result.",
        502,
        "AI_INVALID_RESPONSE"
      );
    }

    return payload.result;
  } catch (error) {
    console.error(
      "BACKEND → AI SCREENSHOT ERROR:",
      {
        name: error?.name,
        code: error?.code,
        status: error?.status,
        message: error?.message,
      }
    );

    if (
      error?.status ||
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

    throw createAIServiceError(
      "Could not connect to AI screenshot service.",
      503,
      "AI_SERVICE_UNAVAILABLE"
    );
  }
}

/**
 * Create analysis
 */
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
     * The backend obtains the authoritative result from
     * the AI Intelligence Service.
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
     *
     * IMPORTANT:
     * The supplied URL is NEVER visited.
     *
     * It is sent only to the local AI
     * Intelligence Service for static analysis.
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

      /*
       * First get the raw URL intelligence result.
       */
      const urlResult =
        await analyzeUrlWithAI(
          originalInput.trim()
        );

      /*
       * Convert URL intelligence output
       * into the common AnalysisResult shape
       * required by Prisma.
       */
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
     *
     * This prevents Prisma from receiving
     * undefined classification/riskScore/etc.
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
     * PERSIST ANALYSIS
     * --------------------------------------
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
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis error:", { code: error?.code, status: error?.status });

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
      error?.code === "INVALID_URL"
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
 * This is read-only and does not modify the
 * message / URL / screenshot analysis flow.
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







