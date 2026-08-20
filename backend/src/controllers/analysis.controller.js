import { createAnalysis } from "../services/analysis.service.js";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:6100";

/**
 * Analyze a text message through the AI Intelligence Service.
 */
async function analyzeMessageWithAI(originalInput) {
  const url = `${AI_SERVICE_URL}/analyze`;

  console.log("Sending message to AI:", {
    url,
  });

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
      throw new Error(
        "AI service returned an invalid response."
      );
    }

    if (!response.ok) {
      throw new Error(
        payload?.message ||
          payload?.error ||
          `AI service returned HTTP ${response.status}.`
      );
    }

    if (!payload?.result) {
      throw new Error(
        payload?.message ||
          "AI service returned an empty analysis result."
      );
    }

    return payload.result;
  } catch (error) {
    console.error(
      "BACKEND → AI MESSAGE ERROR:",
      error
    );

    if (
      error?.message?.includes("AI service") ||
      error?.message?.includes("AI provider")
    ) {
      throw error;
    }

    throw new Error(
      `Could not connect to AI service at ${AI_SERVICE_URL}.`
    );
  }
}

/**
 * Analyze a screenshot through the AI Intelligence Service.
 *
 * The original uploaded file is converted to a Blob and sent
 * as multipart/form-data using the field name expected by the
 * AI service: "image".
 */
async function analyzeScreenshotWithAI(file) {
  if (!file?.buffer) {
    throw new Error(
      "Screenshot file is required."
    );
  }

  const url =
    `${AI_SERVICE_URL}/analyze-screenshot`;

  console.log("Sending screenshot to AI:", {
    url,
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  });

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

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      throw new Error(
        "AI screenshot service returned an invalid response."
      );
    }

    console.log(
      "AI SCREENSHOT RESPONSE:",
      {
        status: response.status,
        ok: response.ok,
        hasResult: Boolean(payload?.result),
        message: payload?.message,
      }
    );

    if (!response.ok) {
      throw new Error(
        payload?.message ||
          payload?.error ||
          `AI screenshot service returned HTTP ${response.status}.`
      );
    }

    if (!payload?.result) {
      throw new Error(
        payload?.message ||
          "AI screenshot service returned an empty analysis result."
      );
    }

    return payload.result;
  } catch (error) {
    console.error(
      "BACKEND → AI SCREENSHOT ERROR:",
      error
    );

    if (
      error?.message?.includes("AI service") ||
      error?.message?.includes("AI provider") ||
      error?.message?.includes("screenshot")
    ) {
      throw error;
    }

    throw new Error(
      `Could not connect to AI screenshot service at ${AI_SERVICE_URL}.`
    );
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
        hasFile: Boolean(req.file),
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
    if (inputType === "message") {
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
    else if (inputType === "url") {
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
      inputType === "screenshot"
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
          inputType === "screenshot"
            ? req.file?.originalname ||
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
      "Stack:",
      error?.stack
    );

    console.error(
      "===================================="
    );

    next(error);
  }
}