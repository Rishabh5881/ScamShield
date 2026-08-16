import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getDashboardAnalyticsController,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  getDashboardAnalyticsController
);

export default router;