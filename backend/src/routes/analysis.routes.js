import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  createAnalysisController,
} from "../controllers/analysis.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/",
  authenticate,
  upload.single("file"),
  createAnalysisController
);

export default router;