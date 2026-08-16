import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createAnalysisController } from "../controllers/analysis.controller.js";

const router = express.Router();

router.post("/", authenticate, createAnalysisController);

export default router;