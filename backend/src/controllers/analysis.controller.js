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
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

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
 * Analyze a URL through the SAFE STATIC URL pipeline.
 *
 * IMPORTANT:
 * The user supplied URL is NEVER requested.
 *
 * The only network request here is to our own
 * local AI Intelligence Service.
 */
async function analyzeUrlWithAI(
  originalInput
) {
  const url =
    `${AI_SERVICE_URL}/analyze-url`;

  console.log(
    "Sending URL for STATIC analysis:",
    {
      serviceUrl: url,
    }
  );

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

    if (
      error?.status ||
      error?.code ===
        "AI_QUOTA_EXCEEDED"
    ) {
      throw error;
    }

    const networkError =
      createAIServiceError(
        "Could not connect to AI screenshot service.",
        503,
        "AI_SERVICE_UNAVAILABLE"
      );

    throw networkError;
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
     * SAFE STATIC URL ANALYSIS
     *
     * IMPORTANT:
     * The supplied URL is NEVER visited.
     *
     * It is sent only to the local AI service
     * as a string for static parsing and risk analysis.
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

      analysisResult =
        await analyzeUrlWithAI(
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
      "Invalid URL"
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
 * This is read-only and does not modify the existing
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
    console.error(
      "GET ANALYSIS HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch analysis history.",
    });
  }
}