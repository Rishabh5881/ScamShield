import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getHistoryController } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/", authenticate, getHistoryController);

export default router;