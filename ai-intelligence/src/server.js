import "dotenv/config";
import express from "express";
import multer from "multer";

import { analyzeMessage } from "./services/message-analysis.service.js";
import { analyzeScreenshot } from "./screenshot/services/screenshot-analysis.service.js";

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "ScamShield AI service is running",
  });
});

app.post("/analyze", async (req, res) => {
  try {
    const result = await analyzeMessage(req.body?.message);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message:
        error.message || "AI analysis failed.",
    });
  }
});

app.post(
  "/analyze-screenshot",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Screenshot image is required.",
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
      return res.status(502).json({
        success: false,
        message:
          error.message ||
          "Screenshot analysis failed.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `ScamShield AI service running on port ${PORT}`
  );
});