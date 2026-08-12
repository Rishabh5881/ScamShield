import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScamShield backend is running",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;