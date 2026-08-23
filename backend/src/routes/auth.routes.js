import express from "express";
import rateLimit from "express-rate-limit";

import {
  signupController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/signup", authLimiter, signupController);

router.post("/login", authLimiter, loginController);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post("/logout", authenticate, logoutController);

export default router;