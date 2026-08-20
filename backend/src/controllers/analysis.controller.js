import { createAnalysis } from "../services/analysis.service.js";

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
async function analyzeMessageWithAI(
  originalInput
) {
  const url = `${AI_SERVICE_URL}/analyze`;

  console.log(
    "Sending message to AI:",
    {
      url,
    }
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
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

    /*
     * Preserve AI service errors.
     *
     * Especially important for:
     * 429 AI quota
     * 503 AI unavailable
     * 502 invalid AI response
     */
    if (
      error?.status ||
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

    /*
     * Network-level failure:
     * AI service could not be reached.
     */
    const networkError =
      createAIServiceError(
        "Could not connect to AI service.",
        503,
        "AI_SERVICE_UNAVAILABLE"
      );

    throw networkError;
  }
}

/**
 * Analyze a screenshot through the AI Intelligence Service.
 *
 * The original uploaded file is converted to a Blob and sent
 * as multipart/form-data using the field name expected by
 * the AI service: "image".
 */
async function analyzeScreenshotWithAI(
  file
) {
  if (!file?.buffer) {
    throw createAIServiceError(
      "Screenshot file is required.",
      400,
      "SCREENSHOT_REQUIRED"
    );
  }

  const url =
    `${AI_SERVICE_URL}/analyze-screenshot`;

  console.log(
    "Sending screenshot to AI:",
    {
      url,
      fileName:
        file.originalname,
      mimeType:
        file.mimetype,
      size: file.size,
    }
  );

  try {
    const formData =
      new FormData();

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

    console.log(
      "AI SCREENSHOT RESPONSE:",
      {
        status:
          response.status,
        ok:
          response.ok,
        hasResult:
          Boolean(
            payload?.result
          ),
        code:
          payload?.error?.code ||
          payload?.code,
      }
    );

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

    /*
     * Preserve AI service errors.
     */
    if (
      error?.status ||
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

    /*
     * Network-level failure.
     */
    const networkError =
      createAIServiceError(
        "Could not connect to AI screenshot service.",
        503,
        "AI_SERVICE_UNAVAILABLE"
      );

    throw networkError;
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
     * The backend obtains the authoritative result from
     * the AI Intelligence Service.
     */
    const {
      inputType,
      originalInput,
    } = req.body || {};

    console.log(
      "ANALYSIS REQUEST:",
      {
        inputType,
        hasFile:
          Boolean(req.file),
        fileName:
          req.file?.originalname,
        mimeType:
          req.file?.mimetype,
        fileSize:
          req.file?.size,
      }
    );

    if (!inputType) {
      return res.status(400).json({
        success: false,
        message:
          "inputType is required.",
      });
    }

    let analysisResult;

    /*
     * MESSAGE ANALYSIS
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

      analysisResult =
        await analyzeMessageWithAI(
          originalInput.trim()
        );
    }

    /*
     * URL ANALYSIS
     *
     * URL analysis uses the existing AI message
     * pipeline. The AI service performs URL intelligence
     * and hybrid risk analysis.
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

      analysisResult =
        await analyzeMessageWithAI(
          originalInput.trim()
        );
    }

    /*
     * SCREENSHOT ANALYSIS
     */
    else if (
      inputType ===
      "screenshot"
    ) {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Screenshot file is required.",
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
     * UNSUPPORTED INPUT TYPE
     */
    else {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported input type.",
      });
    }

    /*
     * Persist only the result generated by
     * the AI Intelligence Service.
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
    console.error(
      "========== ANALYSIS ERROR =========="
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Code:",
      error?.code
    );

    console.error(
      "Status:",
      error?.status
    );

    console.error(
      "Stack:",
      error?.stack
    );

    console.error(
      "===================================="
    );

    /*
     * --------------------------------------
     * AI QUOTA / RATE LIMIT
     * --------------------------------------
     *
     * Preserve 429 instead of converting it
     * into a generic 500.
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