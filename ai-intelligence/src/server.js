import "dotenv/config";
import express from "express";
import { analyzeMessage } from "./services/message-analysis.service.js";

const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "ScamShield AI service is running" });
});

app.post("/analyze", async (req, res) => {
  try {
    const result = await analyzeMessage(req.body?.message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message || "AI analysis failed." });
  }
});

app.listen(PORT, () => {
  console.log(`ScamShield AI service running on port ${PORT}`);
});
