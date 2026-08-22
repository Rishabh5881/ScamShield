import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/auth.middleware.js";
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

router.post(
  "/",
  authenticate,
  upload.single("file"),
  createAnalysisController
);

router.get(
  "/history",
  authenticate,
  getAnalysisHistoryController
);

export default router;
