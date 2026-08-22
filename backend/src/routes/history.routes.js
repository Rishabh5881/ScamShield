import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getHistoryController,
  getHistoryDetailsController,
} from "../controllers/history.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getHistoryController
);

router.get(
  "/:id",
  authenticate,
  getHistoryDetailsController
);

export default router;
