import "dotenv/config";
import express from "express";
import multer from "multer";

import { analyzeMessage } from "./services/message-analysis.service.js";
import { analyzeScreenshot } from "./screenshot/services/screenshot-analysis.service.js";

const app = express();
const PORT = process.env.PORT || 6100;

app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ==========================================
// HEALTH
// ==========================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "ScamShield AI service is running",
  });
});

// ==========================================
// MESSAGE / URL ANALYSIS
// ==========================================

app.post("/analyze", async (req, res, next) => {
  try {
    const result = await analyzeMessage(req.body?.message);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return next(error);
  }
});

// ==========================================
// SCREENSHOT ANALYSIS
// ==========================================

app.post(
  "/analyze-screenshot",
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: "SCREENSHOT_REQUIRED",
            message: "Screenshot image is required.",
            retryable: false,
          },
        });
      }

      const result = await analyzeScreenshot({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
      });

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

// ==========================================
// GLOBAL AI SERVICE ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("AI SERVICE ERROR:", {
    name: error?.name,
    code: error?.code,
    status: error?.status,
    message: error?.message,
  });

  // ------------------------------------------
  // AI PROVIDER QUOTA / RATE LIMIT
  // ------------------------------------------

  if (
    error?.status === 429 ||
    error?.code === "AI_QUOTA_EXCEEDED"
  ) {
    return res.status(429).json({
      success: false,
      error: {
        code: "AI_QUOTA_EXCEEDED",
        message:
          "AI analysis is temporarily unavailable because the AI provider quota has been reached.",
        retryable: true,
      },
    });
  }

  // ------------------------------------------
  // AUTH / CONFIG ERROR
  // ------------------------------------------

  if (
    error?.status === 401 ||
    error?.status === 403
  ) {
    return res.status(502).json({
      success: false,
      error: {
        code: "AI_PROVIDER_AUTH_ERROR",
        message:
          "AI analysis is temporarily unavailable.",
        retryable: true,
      },
    });
  }

  // ------------------------------------------
  // INVALID / BAD AI RESPONSE
  // ------------------------------------------

  if (
    error?.code === "AI_INVALID_RESPONSE" ||
    error?.code === "AI_EMPTY_RESPONSE"
  ) {
    return res.status(502).json({
      success: false,
      error: {
        code: "AI_INVALID_RESPONSE",
        message:
          "AI provider returned an invalid analysis response.",
        retryable: true,
      },
    });
  }

  // ------------------------------------------
  // PROVIDER TEMPORARILY UNAVAILABLE
  // ------------------------------------------

  if (
    error?.status === 500 ||
    error?.status === 502 ||
    error?.status === 503 ||
    error?.status === 504
  ) {
    return res.status(503).json({
      success: false,
      error: {
        code: "AI_SERVICE_UNAVAILABLE",
        message:
          "AI analysis is temporarily unavailable. Please try again later.",
        retryable: true,
      },
    });
  }

  // ------------------------------------------
  // SAFE DEFAULT
  // ------------------------------------------

  return res.status(500).json({
    success: false,
    error: {
      code: "AI_SERVICE_ERROR",
      message:
        "AI analysis is temporarily unavailable.",
      retryable: true,
    },
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `ScamShield AI service running on port ${PORT}`
  );
});