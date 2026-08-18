import { createAnalysis } from "../services/analysis.service.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:6000";

async function analyzeWithAI(inputType, originalInput) {
  if (inputType !== "message") {
    throw new Error("URL and screenshot analysis are not connected to the AI service yet.");
  }
  const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: originalInput }),
  });
  let payload = null;
  try { payload = await response.json(); } catch { throw new Error("AI service returned an invalid response."); }
  if (!response.ok || !payload?.result) throw new Error(payload?.message || "AI service could not analyze the signal.");
  return payload.result;
}

export async function createAnalysisController(req, res, next) {
  try {
    const { inputType, originalInput, result } = req.body;
    if (!inputType || !originalInput) return res.status(400).json({ success: false, message: "inputType and originalInput are required." });
    const analysisResult = result || await analyzeWithAI(inputType, originalInput);
    const analysis = await createAnalysis({ userId: req.user.id, inputType, originalInput, result: analysisResult });
    res.status(201).json({ success: true, data: analysis });
  } catch (error) { next(error); }
}
