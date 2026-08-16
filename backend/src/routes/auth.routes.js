import express from "express";

import {
  signupController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.post("/logout", authenticate, logoutController);

export default router;