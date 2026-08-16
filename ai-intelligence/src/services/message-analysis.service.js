import {
  messageSystemPrompt,
  buildMessageUserPrompt,
} from "../prompts/message.prompt.js";

import { generateAIResponse } from "../providers/gemini.provider.js";

import {
  validateAnalysisOutput,
} from "../schemas/analysis.schema.js";

import {
  calculateRiskScore,
  getSeverity,
} from "../risk/risk.engine.js";

export async function analyzeMessage(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Message text is required");
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("Message cannot be empty");
  }

  if (trimmedText.length > 10000) {
    throw new Error("Message is too long");
  }

  const rawResponse = await generateAIResponse({
    systemPrompt: messageSystemPrompt,
    userPrompt: buildMessageUserPrompt(trimmedText),
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const validation = validateAnalysisOutput(parsedResponse);

  if (!validation.success) {
    throw new Error("AI response failed schema validation");
  }

  const aiResult = validation.data;

  const risk = calculateRiskScore(trimmedText, aiResult);

  return {
    classification: aiResult.classification,
    riskScore: risk.riskScore,
    confidence: aiResult.confidence,
    scamType: aiResult.scamType,
    severity: getSeverity(risk.riskScore),
    redFlags: aiResult.redFlags,
    attackPattern: aiResult.attackPattern,
    explanation: aiResult.explanation,
    recommendedActions: aiResult.recommendedActions,
    detectedSignals: risk.detectedSignals,
  };
}