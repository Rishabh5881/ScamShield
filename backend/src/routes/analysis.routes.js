import express from "express";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  allowAuthenticatedOrGuest,
} from "../middleware/guestAnalysis.middleware.js";

import {
  createAnalysisController,
  getAnalysisHistoryController,
} from "../controllers/analysis.controller.js";

const router = express.Router();

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ALLOWED_FILE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      const error = new Error(
        "Unsupported screenshot format. Use PNG, JPEG, or WEBP."
      );

      error.statusCode = 400;
      error.code = "UNSUPPORTED_FILE_TYPE";

      return cb(error);
    }

    cb(null, true);
  },
});

async function validateScreenshotFile(req, res, next) {
  try {
    const file = req.file;

    if (!file?.buffer) {
      return next();
    }

    const detectedType = await fileTypeFromBuffer(file.buffer);

    if (!detectedType) {
      const error = new Error(
        "Unable to verify screenshot file type."
      );

      error.statusCode = 400;
      error.code = "INVALID_FILE_SIGNATURE";

      return next(error);
    }

    const detectedMime = detectedType.mime;
    const detectedExtension = detectedType.ext;

    const normalizedMime =
      file.mimetype === "image/jpg"
        ? "image/jpeg"
        : file.mimetype;

    const normalizedDetectedMime =
      detectedMime === "image/jpg"
        ? "image/jpeg"
        : detectedMime;

    if (
      !ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
      !ALLOWED_IMAGE_TYPES.includes(normalizedDetectedMime) ||
      normalizedMime !== normalizedDetectedMime ||
      !ALLOWED_FILE_EXTENSIONS.includes(detectedExtension)
    ) {
      const error = new Error(
        "Screenshot file content does not match the declared file type."
      );

      error.statusCode = 400;
      error.code = "INVALID_FILE_SIGNATURE";

      return next(error);
    }

    req.file.detectedMimeType = detectedMime;
    req.file.detectedExtension = detectedExtension;

    next();
  } catch (error) {
    next(error);
  }
}

/*
 * Analysis:
 * - Logged-in users are allowed.
 * - Guests get one free analysis.
 */
router.post(
  "/",
  allowAuthenticatedOrGuest,
  upload.single("file"),
  validateScreenshotFile,
  createAnalysisController
);

/*
 * History remains protected.
 * Guests cannot access authenticated history.
 */
router.get(
  "/history",
  authenticate,
  getAnalysisHistoryController
);

export default router;